const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;
const { createHttpError } = require("../utils/errors");

// Helper to reliably extract public_id from a standard Cloudinary URL 
// (fallback for old images that might not have correct filename in DB)
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Cloudinary standard URLs look like: 
  // http://res.cloudinary.com/cloudname/image/upload/v1234/folder/public_id.jpg
  if (!url.includes('cloudinary.com')) return null;

  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Everything after upload/ (and optional version /v.../) is the public_id
    // Wait, the path might include a version like v161231231
    let publicIdWithExt = parts.slice(uploadIndex + 1).join('/');
    if (publicIdWithExt.match(/^v\d+\//)) {
      publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '');
    }
    
    // Remove query params if any
    publicIdWithExt = publicIdWithExt.split('?')[0];

    // Remove file extension
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      publicIdWithExt = publicIdWithExt.substring(0, lastDotIndex);
    }
    return publicIdWithExt;
  } catch (e) {
    return null;
  }
}

async function deleteZoneCascade(projectId, zoneId, user) {
  console.log(`[ZONE DELETE START] Project: ${projectId}, Zone: ${zoneId}`);

  // 1. Validar acceso al proyecto
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ...(user.role !== "admin" && user.role !== "project_admin" ? {
        userProjects: { some: { userId: Number(user.id) } }
      } : {})
    }
  });

  if (!project) {
    throw createHttpError(404, "Proyecto no encontrado o sin permisos");
  }

  let data = {};
  let settings = {};
  try {
    data = project.data ? JSON.parse(project.data) : {};
    settings = project.settings ? JSON.parse(project.settings) : {};
  } catch (e) {
    throw createHttpError(500, "Error decodificando datos del proyecto");
  }

  const experiences = data.experiences || [];
  const scenes = data.scenes || {};
  const mapByZone = settings.mapByZone || {};

  // 2. Verificar que la zona existe
  const zoneIndex = experiences.findIndex(exp => String(exp.id) === String(zoneId));
  if (zoneIndex === -1) {
    throw createHttpError(404, "La zona no existe en el proyecto");
  }

  console.log(`[ZONE FOUND] Name: ${experiences[zoneIndex].name}`);

  // 3. Buscar escenas exclusivas de la zona
  // Se asume que una escena pertenece a una sola zona si su map.zoneId === zoneId
  const scenesToDelete = [];
  const scenesToKeep = {};

  Object.entries(scenes).forEach(([sceneKey, sceneObj]) => {
    const sceneZoneId = sceneObj?.map?.zoneId || sceneObj?.zoneId || sceneObj?.zone;
    if (String(sceneZoneId) === String(zoneId)) {
      scenesToDelete.push({ sceneKey, ...sceneObj });
    } else {
      scenesToKeep[sceneKey] = sceneObj;
    }
  });

  console.log(`[SCENES FOUND]: ${scenesToDelete.length}`);

  // 4. Buscar urls a limpiar
  const urlsToClean = new Set();

  let hotspotsFoundCount = 0;

  scenesToDelete.forEach(scene => {
    if (scene.image) urlsToClean.add(scene.image);
    if (scene.previewImage) urlsToClean.add(scene.previewImage);
    if (scene.thumbnail) urlsToClean.add(scene.thumbnail);

    if (scene.hotSpots) {
      Object.values(scene.hotSpots).forEach(hotspot => {
        hotspotsFoundCount++;
        if (hotspot.coverImage) urlsToClean.add(hotspot.coverImage);
        if (hotspot.previewImage) urlsToClean.add(hotspot.previewImage);
        if (hotspot.thumbnail) urlsToClean.add(hotspot.thumbnail);
        if (hotspot.image) urlsToClean.add(hotspot.image);
        if (Array.isArray(hotspot.attachments)) {
          hotspot.attachments.forEach(att => {
            if (att.url) urlsToClean.add(att.url);
          });
        }
      });
    }
  });

  // Verificar si hay plano asignado a esta zona en settings
  if (mapByZone[zoneId]?.mapUrl) {
    urlsToClean.add(mapByZone[zoneId].mapUrl);
  }

  console.log(`[HOTSPOTS FOUND]: ${hotspotsFoundCount}`);
  
  // Limpiar URLs vacías o inválidas
  const validUrls = Array.from(urlsToClean).filter(u => u && typeof u === 'string' && u.trim().startsWith('http'));

  // 5. Verificar si alguna URL está siendo utilizada por las escenas QUE SE CONSERVAN
  // Para evitar borrar assets compartidos (e.g. iconos)
  const sharedUrls = new Set();
  Object.values(scenesToKeep).forEach(scene => {
    if (scene.image && urlsToClean.has(scene.image)) sharedUrls.add(scene.image);
    if (scene.previewImage && urlsToClean.has(scene.previewImage)) sharedUrls.add(scene.previewImage);
    if (scene.thumbnail && urlsToClean.has(scene.thumbnail)) sharedUrls.add(scene.thumbnail);
    
    if (scene.hotSpots) {
      Object.values(scene.hotSpots).forEach(hotspot => {
        if (hotspot.coverImage && urlsToClean.has(hotspot.coverImage)) sharedUrls.add(hotspot.coverImage);
        if (Array.isArray(hotspot.attachments)) {
          hotspot.attachments.forEach(att => {
            if (att.url && urlsToClean.has(att.url)) sharedUrls.add(att.url);
          });
        }
      });
    }
  });

  const exclusiveUrlsToClean = validUrls.filter(url => !sharedUrls.has(url));

  // 6. Encontrar los registros de imagenes en la BD y sus public_ids de Cloudinary
  const imagesInDb = await prisma.image.findMany({
    where: {
      url: { in: exclusiveUrlsToClean },
      projectId: projectId
    }
  });

  const dbUrlToPublicId = {};
  imagesInDb.forEach(img => {
    dbUrlToPublicId[img.url] = img.filename; // filename usually holds the public_id from multer-storage-cloudinary
  });

  const cloudinaryResources = [];
  exclusiveUrlsToClean.forEach(url => {
    let publicId = dbUrlToPublicId[url];
    if (!publicId) {
      publicId = extractPublicIdFromUrl(url);
    }
    if (publicId) {
      cloudinaryResources.push({ url, publicId });
    }
  });

  console.log(`[CLOUDINARY ASSETS FOUND]: ${cloudinaryResources.length} exclusivos`);

  // 7. Aplicar cambios a la BD en Transacción
  const nextExperiences = experiences.filter(exp => String(exp.id) !== String(zoneId));
  const nextMapByZone = { ...mapByZone };
  delete nextMapByZone[zoneId];

  data.experiences = nextExperiences;
  data.scenes = scenesToKeep;
  settings.mapByZone = nextMapByZone;

  const imageIdsToDelete = imagesInDb.map(img => img.id);

  try {
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          data: JSON.stringify(data),
          settings: JSON.stringify(settings),
          dateModified: new Date().toISOString()
        }
      }),
      ...(imageIdsToDelete.length > 0 ? [
        prisma.image.deleteMany({
          where: { id: { in: imageIdsToDelete } }
        })
      ] : [])
    ]);
    console.log(`[DATABASE DELETE SUCCESS] Project JSON updated and ${imageIdsToDelete.length} images records deleted.`);
  } catch (error) {
    console.error("[DATABASE DELETE FAILED]", error);
    throw createHttpError(500, "Error eliminando datos en base de datos. Transacción revertida.");
  }

  // 8. Limpiar archivos físicos en Cloudinary
  console.log(`[CLOUDINARY CLEANUP START]`);
  
  const failedCloudinary = [];
  
  if (process.env.CLOUDINARY_URL) {
    const cleanupPromises = cloudinaryResources.map(async (resource) => {
      try {
        await cloudinary.uploader.destroy(resource.publicId);
      } catch (err) {
        console.error(`[CLOUDINARY DELETE FAILED] publicId: ${resource.publicId}, Error:`, err.message);
        failedCloudinary.push({ resource, error: err.message });
      }
    });

    // Se ejecutan en paralelo para no bloquear
    // Usamos Promise.allSettled para que no rompa si una falla
    await Promise.allSettled(cleanupPromises);
    console.log(`[CLOUDINARY DELETE COMPLETE] Failed: ${failedCloudinary.length}`);
  }

  console.log(`[ZONE DELETE COMPLETE] ${zoneId}`);

  return {
    success: true,
    message: "Zona y escenas eliminadas correctamente",
    cloudinaryCleaned: cloudinaryResources.length - failedCloudinary.length,
    cloudinaryFailed: failedCloudinary.length,
    failedCloudinary
  };
}

module.exports = {
  deleteZoneCascade
};
