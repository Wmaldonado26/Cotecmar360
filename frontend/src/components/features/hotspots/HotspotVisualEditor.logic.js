import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaTimes,
  FaSave,
  FaTrash,
  FaPlus,
  FaEdit,
  FaCrosshairs,
  FaCheck,
  FaPaperclip,
  FaFilePdf,
  FaImage,
  FaCamera,
  FaUpload,
  FaSearchMinus,
  FaSearchPlus,
  FaUndoAlt,
  FaMapPin,
  FaInfoCircle,
  FaFolderOpen,
  FaShip,
  FaGripVertical,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { API_BASE_URL } from "../../../services/apiConfig";
import authService from "../../../services/AuthService";

const HOTSPOT_TYPE_META = {
  moveScene: {
    label: "Navegación",
    hint: "Salta a otra escena al hacer click",
    accent: "#0057b8",
    soft: "#eef4ff",
    Icon: FaShip,
  },
  infoHotspot: {
    label: "Información",
    hint: "Muestra un tooltip con título y descripción",
    accent: "#0ea5e9",
    soft: "#ecfeff",
    Icon: FaInfoCircle,
  },
  hotSpotElement: {
    label: "Elemento",
    hint: "Muestra un álbum con anexos (PDF, imágenes, videos)",
    accent: "#6366f1",
    soft: "#eef2ff",
    Icon: FaFolderOpen,
  },
};

const formatSceneName = (raw, fallback) => {
  const text = String(raw || fallback || "Escena");
  return text
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function useHotspotVisualEditorLogic(props) {
  const { projectId, scene, sceneKey, allScenes, onSave, onClose, onImageUploaded } = props;

  const viewerRef = useRef(null);
  const pannellumRef = useRef(null);
  const coordsTickRef = useRef(null);

  const [hotspots, setHotspots] = useState(scene.hotSpots || {});
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [editingHotspot, setEditingHotspot] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);

  const [viewerReady, setViewerReady] = useState(false);
  const [uploadingSceneImage, setUploadingSceneImage] = useState(false);
  const [sceneImageUrl, setSceneImageUrl] = useState(scene.image || "");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [liveCoords, setLiveCoords] = useState({ pitch: null, yaw: null, hfov: 100 });
  const [previewHoveredScene, setPreviewHoveredScene] = useState(null);
  const [attachmentsSearch, setAttachmentsSearch] = useState({});

  const [uploadingCoverMap, setUploadingCoverMap] = useState({});

  const hotspotCount = Object.keys(hotspots).length;
  const navCount = Object.values(hotspots).filter(
    (h) => h.cssClass === "moveScene" && h.scene
  ).length;

  const UPLOAD_URL = `${API_BASE_URL}/upload`;

  const uploadImageToBackend = async ({ file, type }) => {
    if (!projectId) {
      throw new Error("No hay projectId. Cierra y vuelve a abrir el editor.");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("projectId", projectId);
    formData.append("type", type);

    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: authService.getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      let msg = "No se pudo subir el archivo.";
      try {
        const data = await res.json();
        msg = data?.error || data?.message || msg;
      } catch {}
      throw new Error(msg);
    }

    return await res.json();
  };

  useEffect(() => {
    const safeImage = String(sceneImageUrl || scene.image || "").trim();
    if (!viewerRef.current || !safeImage || pannellumRef.current) return;

    const safePreview = [scene.previewImage, scene.thumbnail]
      .filter((x) => x && typeof x === "string" && x.trim())
      .map((x) => String(x).trim())[0] || null;

    const viewer = window.pannellum.viewer(viewerRef.current, {
      type: "equirectangular",
      panorama: safeImage,
      autoLoad: true,
      showControls: false,
      mouseZoom: true,
      draggable: true,
      pitch: scene.pitch || 0,
      yaw: scene.yaw || 0,
      hfov: 100,
      minHfov: 50,
      maxHfov: 150,
      minPitch: -90,
      maxPitch: 90,
      doubleClickZoom: false,
      compass: false,
      ...(safePreview ? { preview: safePreview, previewLoad: true } : {}),
      crossOrigin: "anonymous",
      haov: 360,
      vaov: 180,
      vOffset: 0,
      hOffset: 0,
    });

    viewer.on("load", () => {
      pannellumRef.current = viewer;
      setViewerReady(true);
    });

    return () => {
      if (pannellumRef.current && pannellumRef.current.destroy) {
        pannellumRef.current.destroy();
        pannellumRef.current = null;
        setViewerReady(false);
      }
    };
  }, [sceneImageUrl, scene.image, scene.previewImage, scene.thumbnail, scene.pitch, scene.yaw]);

  useEffect(() => {
    if (!viewerReady || !pannellumRef.current) {
      if (coordsTickRef.current) {
        cancelAnimationFrame(coordsTickRef.current);
        coordsTickRef.current = null;
      }
      setLiveCoords({ pitch: null, yaw: null, hfov: 100 });
      return;
    }
    const tick = () => {
      try {
        const v = pannellumRef.current;
        setLiveCoords({ pitch: v.getPitch(), yaw: v.getYaw(), hfov: v.getHfov() });
      } catch {}
      coordsTickRef.current = requestAnimationFrame(tick);
    };
    coordsTickRef.current = requestAnimationFrame(tick);
    return () => {
      if (coordsTickRef.current) cancelAnimationFrame(coordsTickRef.current);
    };
  }, [viewerReady]);

  useEffect(() => {
    if (!placementMode) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setPlacementMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [placementMode]);

  const handleSceneImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !projectId) {
      event.target.value = "";
      return;
    }
    setUploadingSceneImage(true);
    try {
      const data = await uploadImageToBackend({ file, type: `scene_${sceneKey}` });
      const urlWithTimestamp = `${data.url}?t=${Date.now()}`;
      setSceneImageUrl(urlWithTimestamp);
      if (typeof onImageUploaded === "function") onImageUploaded(urlWithTimestamp);
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo subir la imagen 360°.");
    } finally {
      setUploadingSceneImage(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (!pannellumRef.current || !viewerReady) return;

    const viewer = pannellumRef.current;

    const renderHotspots = () => {
      Object.keys(hotspots).forEach((key) => {
        try {
          viewer.removeHotSpot(key);
        } catch (e) {}
      });

      Object.entries(hotspots).forEach(([key, hotspot]) => {
        try {
          const meta = HOTSPOT_TYPE_META[hotspot.cssClass] || HOTSPOT_TYPE_META.moveScene;
          const dotColor = selectedHotspot === key ? "#f59e0b" : meta.accent;
          viewer.addHotSpot({
            id: key,
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            type: "custom",
            cssClass: `visual-editor-marker ${selectedHotspot === key ? "selected" : ""}`,
            createTooltipFunc: (hotSpotDiv) => {
              hotSpotDiv.innerHTML = "";
              hotSpotDiv.style.display = "block";
              hotSpotDiv.style.position = "absolute";
              hotSpotDiv.style.transform = "translate(-50%, -50%)";
              hotSpotDiv.classList.add("visual-editor-marker");
              if (selectedHotspot === key) hotSpotDiv.classList.add("selected");

              const container = document.createElement("div");
              container.className = "visual-marker-wrap";
              container.style.position = "relative";
              container.style.width = "0px";
              container.style.height = "0px";
              container.style.pointerEvents = "visible";
              container.style.transition = "transform .18s ease";

              const halo = document.createElement("div");
              halo.className = "marker-halo";
              halo.style.position = "absolute";
              halo.style.top = "-17px";
              halo.style.left = "-17px";
              halo.style.width = "34px";
              halo.style.height = "34px";
              halo.style.borderRadius = "50%";
              halo.style.background = `radial-gradient(circle, ${dotColor}33 0%, transparent 70%)`;
              halo.style.pointerEvents = "none";
              container.appendChild(halo);

              const dot = document.createElement("div");
              dot.className = "marker-dot";
              dot.style.position = "absolute";
              dot.style.top = "-12px";
              dot.style.left = "-12px";
              dot.style.width = "24px";
              dot.style.height = "24px";
              dot.style.display = "flex";
              dot.style.alignItems = "center";
              dot.style.justifyContent = "center";
              dot.style.fontSize = "11px";
              dot.style.color = "white";
              dot.style.background = dotColor;
              dot.style.border = "3px solid white";
              dot.style.borderRadius = "50%";
              dot.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
              dot.style.cursor = "pointer";
              dot.style.transition = "all .18s ease";
              dot.style.zIndex = "2";
              dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.3 7 12 8 12s8-6.7 8-12c0-4.4-3.6-8-8-8zm0 10.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>`;
              container.appendChild(dot);

              const label = document.createElement("div");
              label.className = "marker-label";
              label.textContent = hotspot.label || hotspot.title || "Hotspot";
              label.style.position = "absolute";
              label.style.top = "18px";
              label.style.left = "50%";
              label.style.transform = "translateX(-50%)";
              label.style.background = "rgba(0, 17, 44, 0.9)";
              label.style.color = "white";
              label.style.padding = "6px 12px";
              label.style.borderRadius = "8px";
              label.style.fontSize = "12px";
              label.style.fontWeight = "600";
              label.style.whiteSpace = "nowrap";
              label.style.textAlign = "center";
              label.style.backdropFilter = "blur(6px)";
              label.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
              label.style.border = `1px solid ${meta.accent}55`;
              label.style.zIndex = "3";
              container.appendChild(label);

              const typeChip = document.createElement("div");
              typeChip.textContent = meta.label;
              typeChip.style.position = "absolute";
              typeChip.style.top = "44px";
              typeChip.style.left = "50%";
              typeChip.style.transform = "translateX(-50%)";
              typeChip.style.background = meta.soft;
              typeChip.style.color = meta.accent;
              typeChip.style.fontSize = "10px";
              typeChip.style.fontWeight = "700";
              typeChip.style.letterSpacing = "0.02em";
              typeChip.style.padding = "3px 8px";
              typeChip.style.borderRadius = "999px";
              typeChip.style.border = `1px solid ${meta.accent}33`;
              typeChip.style.zIndex = "3";
              typeChip.style.whiteSpace = "nowrap";
              container.appendChild(typeChip);

              hotSpotDiv.appendChild(container);

              hotSpotDiv.onclick = (e) => {
                e.stopPropagation();
                handleSelectHotspot(key);
              };
            },
          });
        } catch (e) {
          console.error("Error adding hotspot:", key, e);
        }
      });
    };

    renderHotspots();
    const t = setTimeout(renderHotspots, 100);
    return () => clearTimeout(t);
  }, [hotspots, selectedHotspot, viewerReady]);

  useEffect(() => {
    if (!viewerRef.current) return;
    const container = viewerRef.current;

    const handleClick = (event) => {
      if (!placementMode || !pannellumRef.current) return;

      if (
        event.target.closest(".hotspot-sidebar") ||
        event.target.closest(".visual-editor-controls") ||
        event.target.closest(".placement-mode-banner") ||
        event.target.closest(".visual-editor-help-banner")
      ) {
        return;
      }

      const coords = pannellumRef.current.mouseEventToCoords(event);
      if (!coords) return;

      const hotspotKey = `hotspot_${Date.now()}`;
      const newHotspot = {
        type: "custom",
        pitch: coords[0],
        yaw: coords[1],
        cssClass: "moveScene",
        scene: "",
        label: "Nuevo Hotspot",
        title: "",
        description: "",
        attachments: [],
      };

      setHotspots((prev) => ({ ...prev, [hotspotKey]: newHotspot }));
      setSelectedHotspot(hotspotKey);
      setEditingHotspot(hotspotKey);
      setPlacementMode(false);
    };

    if (placementMode) {
      container.addEventListener("click", handleClick);
      container.style.cursor = "crosshair";
    } else {
      container.style.cursor = "grab";
    }

    return () => container.removeEventListener("click", handleClick);
  }, [placementMode]);

  const handleSelectHotspot = (key) => {
    setSelectedHotspot(key);
    setEditingHotspot(key);
    if (pannellumRef.current && hotspots[key]) {
      try {
        pannellumRef.current.setPitch(hotspots[key].pitch, 300);
        pannellumRef.current.setYaw(hotspots[key].yaw, 300);
      } catch {}
    }
  };

  const handleDeleteHotspot = (key) => {
    const hotspotLabel = hotspots[key]?.label || hotspots[key]?.title || key;
    const ok = window.confirm(
      `¿Eliminar hotspot?\n\nVas a eliminar "${hotspotLabel}". Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    setHotspots((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    if (selectedHotspot === key) {
      setSelectedHotspot(null);
      setEditingHotspot(null);
    }
  };

  const handleUpdateHotspot = (key, field, value) => {
    setHotspots((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    const finalImage = String(sceneImageUrl || scene.image || "").trim();
    const updatedScene = {
      ...scene,
      image: finalImage,
      hotSpots: hotspots,
    };
    onSave(updatedScene);
  };

  const handleResetView = () => {
    if (!pannellumRef.current) return;
    try {
      pannellumRef.current.setPitch(scene.pitch || 0, 500);
      pannellumRef.current.setYaw(scene.yaw || 0, 500);
      pannellumRef.current.setHfov(100, 500);
    } catch {}
  };

  const handleZoom = (dir) => {
    if (!pannellumRef.current) return;
    try {
      const h = pannellumRef.current.getHfov();
      const next = Math.max(50, Math.min(150, h + dir * -15));
      pannellumRef.current.setHfov(next, 250);
    } catch {}
  };

  const handleDuplicateHotspot = (key) => {
    const h = hotspots[key];
    if (!h) return;
    const nk = `hotspot_${Date.now()}`;
    setHotspots((prev) => ({
      ...prev,
      [nk]: {
        ...h,
        pitch: Number((h.pitch || 0).toFixed(2)) + 1,
        yaw: Number((h.yaw || 0).toFixed(2)) + 2,
      },
    }));
  };

  const handleHotspotAttachmentUpload = async (hotspotKey, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadImageToBackend({
        file,
        type: `hotspot_${sceneKey}_${hotspotKey}`,
      });
      const urlWithTimestamp = `${data.url}?t=${Date.now()}`;
      const newAtt = {
        url: urlWithTimestamp,
        filename: data.filename,
        originalName: data.originalName || file.name,
        mimetype: data.mimetype || file.type,
        size: data.size || file.size,
        folder: "Adjuntos",
      };
      setHotspots((prev) => {
        const hs = prev?.[hotspotKey] || {};
        const current = Array.isArray(hs.attachments) ? hs.attachments : [];
        return {
          ...prev,
          [hotspotKey]: {
            ...hs,
            attachments: [...current, newAtt],
          },
        };
      });
    } catch (error) {
      console.error("Error uploading hotspot attachment:", error);
      alert(error.message || "No se pudo subir el adjunto.");
    } finally {
      event.target.value = "";
    }
  };

  const handleHotspotAttachmentsBulkUpload = async (hotspotKey, files) => {
    for (let i = 0; i < files.length; i++) {
      const ev = { target: { files: [files[i]], value: "" } };
      await handleHotspotAttachmentUpload(hotspotKey, ev);
    }
  };

  const handleRemoveHotspotAttachment = (hotspotKey, index) => {
    setHotspots((prev) => {
      const hs = prev?.[hotspotKey] || {};
      const current = Array.isArray(hs.attachments) ? hs.attachments : [];
      const next = current.filter((_, i) => i !== index);
      return { ...prev, [hotspotKey]: { ...hs, attachments: next } };
    });
  };

  const handleUpdateHotspotAttachmentFolder = (hotspotKey, index, folder) => {
    setHotspots((prev) => {
      const hs = prev?.[hotspotKey] || {};
      const current = Array.isArray(hs.attachments) ? hs.attachments : [];
      const next = current.map((a, i) => (i === index ? { ...a, folder } : a));
      return { ...prev, [hotspotKey]: { ...hs, attachments: next } };
    });
  };

  const handleHotspotCoverUpload = async (hotspotKey, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingCoverMap((prev) => ({ ...prev, [hotspotKey]: true }));
    try {
      const data = await uploadImageToBackend({
        file,
        type: `hotspot_cover_${sceneKey}_${hotspotKey}`,
      });
      const urlWithTimestamp = `${data.url}?t=${Date.now()}`;
      setHotspots((prev) => {
        const hs = prev?.[hotspotKey] || {};
        return {
          ...prev,
          [hotspotKey]: {
            ...hs,
            coverImage: urlWithTimestamp,
          },
        };
      });
    } catch (error) {
      console.error("Error uploading hotspot cover:", error);
      alert(error.message || "No se pudo subir la imagen de portada.");
    } finally {
      setUploadingCoverMap((prev) => ({ ...prev, [hotspotKey]: false }));
      event.target.value = "";
    }
  };

  const handleRemoveHotspotCover = (hotspotKey) => {
    setHotspots((prev) => {
      const hs = prev?.[hotspotKey] || {};
      const next = { ...hs };
      delete next.coverImage;
      return { ...prev, [hotspotKey]: next };
    });
  };

  const sceneEntries = useMemo(() => {
    return Object.entries(allScenes || {}).filter(([sk]) => sk !== sceneKey);
  }, [allScenes, sceneKey]);

  const getSceneThumb = (sc) => {
    const candidates = [sc.image, sc.previewImage, sc.thumbnail].filter(Boolean);
    return candidates[0] || null;
  };

  const handleAttachmentsSearchChange = (key, value) => {
    setAttachmentsSearch((prev) => ({ ...prev, [key]: value }));
  };

  const handleTogglePlacementMode = () => setPlacementMode((v) => !v);
  const handleToggleSidebar = () => setSidebarOpen((v) => !v);
  const handleToggleEditingHotspot = (key) =>
    setEditingHotspot((current) => (current === key ? null : key));

  return {
    viewerRef,
    pannellumRef,
    hotspots,
    selectedHotspot,
    editingHotspot,
    placementMode,
    viewerReady,
    uploadingSceneImage,
    sceneImageUrl,
    sidebarOpen,
    liveCoords,
    previewHoveredScene,
    attachmentsSearch,
    uploadingCoverMap,
    hotspotCount,
    navCount,
    HOTSPOT_TYPE_META,
    formatSceneName,
    sceneEntries,
    getSceneThumb,
    setPlacementMode,
    setSidebarOpen,
    setEditingHotspot,
    handleSceneImageUpload,
    handleSelectHotspot,
    handleDeleteHotspot,
    handleUpdateHotspot,
    handleSave,
    handleResetView,
    handleZoom,
    handleDuplicateHotspot,
    handleHotspotAttachmentUpload,
    handleHotspotAttachmentsBulkUpload,
    handleRemoveHotspotAttachment,
    handleUpdateHotspotAttachmentFolder,
    handleHotspotCoverUpload,
    handleRemoveHotspotCover,
    handleAttachmentsSearchChange,
    handleTogglePlacementMode,
    handleToggleSidebar,
    handleToggleEditingHotspot,
    onClose,
    FaTimes,
    FaSave,
    FaTrash,
    FaPlus,
    FaEdit,
    FaCrosshairs,
    FaCheck,
    FaPaperclip,
    FaFilePdf,
    FaImage,
    FaCamera,
    FaUpload,
    FaSearchMinus,
    FaSearchPlus,
    FaUndoAlt,
    FaMapPin,
    FaInfoCircle,
    FaFolderOpen,
    FaShip,
    FaGripVertical,
    FaAngleLeft,
    FaAngleRight,
  };
}
