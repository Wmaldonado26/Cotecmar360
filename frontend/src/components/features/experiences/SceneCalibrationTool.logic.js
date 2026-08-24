import { useEffect, useMemo, useState } from "react";
import dataScene from "../hotspots/utils/dataScene";
import {
  clearSceneYawOffsetDeg,
  getEffectiveSceneYawOffsets,
  getSceneYawOffsetDeg,
  getStoredSceneYawOffsets,
  normalizeYawDeg,
  setSceneYawOffsetDeg,
} from "./utils/sceneCalibration";

const STEP_SMALL = 1;
const STEP_MEDIUM = 5;
const STEP_LARGE = 15;

export default function useSceneCalibrationLogic(props) {
  const { onClose } = props;

  const sceneKeys = useMemo(() => Object.keys(dataScene), []);
  const [sceneKey, setSceneKey] = useState(sceneKeys[0] ?? "insideOne");
  const [pannellumRef, setPannellumRef] = useState(null);

  const [yawLocal, setYawLocal] = useState(0);
  const [pitchLocal, setPitchLocal] = useState(0);
  const [hfov, setHfov] = useState(140);

  const [offsetDeg, setOffsetDeg] = useState(() => getSceneYawOffsetDeg(sceneKey));

  const scene = dataScene[sceneKey];

  useEffect(() => {
    setOffsetDeg(getSceneYawOffsetDeg(sceneKey));
  }, [sceneKey]);

  useEffect(() => {
    let raf = null;

    const tick = () => {
      try {
        const viewer = pannellumRef?.getViewer?.();
        if (viewer) {
          if (typeof viewer.getYaw === "function") setYawLocal(viewer.getYaw());
          if (typeof viewer.getPitch === "function") setPitchLocal(viewer.getPitch());
          if (typeof viewer.getHfov === "function") setHfov(viewer.getHfov());
        }
      } catch {
        // ignore
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pannellumRef]);

  const headingGlobal = useMemo(
    () => normalizeYawDeg((Number(yawLocal) || 0) + (Number(offsetDeg) || 0)),
    [yawLocal, offsetDeg]
  );

  const applyOffsetDelta = (delta) => {
    const next = normalizeYawDeg((Number(offsetDeg) || 0) + delta);
    setOffsetDeg(next);
    setSceneYawOffsetDeg(sceneKey, next);
  };

  const handleOffsetInput = (e) => {
    const v = Number(e.target.value);
    const next = Number.isFinite(v) ? v : 0;
    setOffsetDeg(next);
    setSceneYawOffsetDeg(sceneKey, next);
  };

  const handleSceneChange = (e) => setSceneKey(e.target.value);

  const handleResetScene = () => {
    clearSceneYawOffsetDeg(sceneKey);
    setOffsetDeg(getSceneYawOffsetDeg(sceneKey));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback silencioso
    }
  };

  const copyStoredOnly = () => {
    const stored = getStoredSceneYawOffsets();
    copyToClipboard(JSON.stringify(stored, null, 2));
  };

  const copyAsCode = () => {
    const all = getEffectiveSceneYawOffsets();
    const snippet = `export const SCENE_YAW_OFFSET_DEG = ${JSON.stringify(all, null, 2)};\n`;
    copyToClipboard(snippet);
  };

  const hasValidSceneImage = useMemo(() => {
    return !!(scene && scene.image && String(scene.image).trim());
  }, [scene]);

  const previewImageForPannellum = useMemo(() => {
    if (!scene) return null;
    const candidates = [scene.previewImage, scene.thumbnail].filter(
      (x) => x && typeof x === "string" && x.trim()
    );
    return candidates.length > 0
      ? {
          preview: candidates.map((x) => String(x).trim())[0],
          previewLoad: true,
        }
      : null;
  }, [scene]);

  return {
    STEP_SMALL,
    STEP_MEDIUM,
    STEP_LARGE,
    sceneKeys,
    sceneKey,
    scene,
    yawLocal,
    pitchLocal,
    hfov,
    offsetDeg,
    headingGlobal,
    setPannellumRef,
    handleSceneChange,
    handleOffsetInput,
    applyOffsetDelta,
    handleResetScene,
    copyStoredOnly,
    copyAsCode,
    onClose,
    hasValidSceneImage,
    previewImageForPannellum,
  };
}
