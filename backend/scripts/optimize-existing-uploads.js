const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const UPLOADS = process.argv[2] || path.join(__dirname, "..", "uploads");
const THUMBS = path.join(UPLOADS, "thumbs");

if (!fs.existsSync(THUMBS)) fs.mkdirSync(THUMBS, { recursive: true });

const MAX_360 = 8192;
const JPEG_Q = 78;
const THUMB_W = 512;

function thumbPath(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  return path.join(THUMBS, `${base}.thumb${ext.toLowerCase() === ".png" ? ".jpg" : ext}`);
}

async function processFile(file) {
  const full = path.join(UPLOADS, file);
  let sizeBefore = fs.statSync(full).size;
  const ext = path.extname(file).toLowerCase();
  const isImg = [".jpg", ".jpeg", ".png"].includes(ext);
  if (!isImg) return { file, skipped: "no-img" };

  const tmpOut = path.join(UPLOADS, `_opt_${Date.now()}-${file}`);
  const thumb = thumbPath(full);

  try {
    let pipe = sharp(full, { failOnError: false, limitInputPixels: false });
    const meta = await pipe.metadata().catch(() => null);
    const w = meta?.width || 0;

    if (w > MAX_360) pipe = pipe.resize({ width: MAX_360, withoutEnlargement: true });
    if (ext === ".jpg" || ext === ".jpeg") pipe = pipe.jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" });
    else pipe = pipe.png({ quality: 80, compressionLevel: 9 });
    await pipe.toFile(tmpOut);

    const after = fs.existsSync(tmpOut) ? fs.statSync(tmpOut).size : sizeBefore;
    if (after < sizeBefore) {
      fs.unlinkSync(full);
      fs.renameSync(tmpOut, full);
      sizeBefore = after;
    } else if (fs.existsSync(tmpOut)) {
      fs.unlinkSync(tmpOut);
    }

    if (!fs.existsSync(thumb)) {
      let tpipe = sharp(full, { failOnError: false, limitInputPixels: false }).resize({ width: THUMB_W, withoutEnlargement: true });
      if (ext === ".png") tpipe = tpipe.jpeg({ quality: 72, progressive: true });
      else tpipe = tpipe.jpeg({ quality: 72, progressive: true });
      await tpipe.toFile(thumb);
    }

    const finalSize = fs.statSync(full).size;
    const thumbSize = fs.existsSync(thumb) ? fs.statSync(thumb).size : 0;
    return { file, beforeMB: round(sizeBefore), afterMB: round(finalSize), thumbMB: round(thumbSize), savedMB: round(sizeBefore - finalSize) };
  } catch (e) {
    try { if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut); } catch {}
    return { file, error: e.message };
  }
}

function round(bytes) { return Math.round((bytes / 1024 / 1024) * 100) / 100; }

(async () => {
  const files = fs.readdirSync(UPLOADS).filter(f => fs.statSync(path.join(UPLOADS, f)).isFile());
  console.log(`Archivos: ${files.length}`);
  let totalSaved = 0, totalBefore = 0, totalAfter = 0;
  for (const f of files) {
    const r = await processFile(f);
    if (r.skipped) continue;
    if (r.error) { console.log(`❌ ${r.file}: ${r.error}`); continue; }
    totalBefore += r.beforeMB; totalAfter += r.afterMB; totalSaved += r.savedMB;
    console.log(`✅ ${r.file}: ${r.beforeMB}MB → ${r.afterMB}MB (saved ${r.savedMB}MB, thumb ${r.thumbMB}MB)`);
  }
  console.log(`\n=== TOTAL: ${totalBefore}MB → ${totalAfter}MB, ahorro ${totalSaved}MB ===`);
})();
