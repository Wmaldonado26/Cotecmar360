import React from "react";
import { Pannellum } from "pannellum-react";
import { FaTimes, FaCopy, FaUndo, FaImage } from "react-icons/fa";
import "./SceneCalibrationTool.css";

export default function SceneCalibrationToolView({
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
}) {
  if (!scene) return null;

  return (
    <div className="calibration-root">
      <div className="calibration-topbar">
        <div className="calibration-title">Calibración de orientación (admin)</div>
        <button className="calibration-close" onClick={onClose} title="Cerrar">
          <FaTimes />
        </button>
      </div>

      <div className="calibration-body">
        <div className="calibration-panel">
          <div className="calibration-row">
            <label className="calibration-label">Escena</label>
            <select
              className="calibration-select"
              value={sceneKey}
              onChange={handleSceneChange}
            >
              {sceneKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="calibration-hint">
            1) Pon el viewer mirando “arriba del plano”. 2) Ajusta el offset
            hasta que el minimapa quede alineado.
          </div>

          <div className="calibration-metrics">
            <div>
              <span>yaw local:</span> {Number(yawLocal).toFixed(2)}°
            </div>
            <div>
              <span>pitch:</span> {Number(pitchLocal).toFixed(2)}°
            </div>
            <div>
              <span>hfov:</span> {Number(hfov).toFixed(0)}°
            </div>
            <div>
              <span>offset escena:</span> {Number(offsetDeg).toFixed(0)}°
            </div>
            <div>
              <span>heading global:</span> {Number(headingGlobal).toFixed(2)}°
            </div>
          </div>

          <div className="calibration-row">
            <label className="calibration-label">Offset (°)</label>
            <input
              className="calibration-input"
              type="number"
              value={Number(offsetDeg)}
              onChange={handleOffsetInput}
              step={1}
            />
          </div>

          <div className="calibration-buttons">
            <button
              className="calibration-btn"
              onClick={() => applyOffsetDelta(-STEP_LARGE)}
            >
              -{STEP_LARGE}
            </button>
            <button
              className="calibration-btn"
              onClick={() => applyOffsetDelta(-STEP_MEDIUM)}
            >
              -{STEP_MEDIUM}
            </button>
            <button
              className="calibration-btn"
              onClick={() => applyOffsetDelta(-STEP_SMALL)}
            >
              -{STEP_SMALL}
            </button>
            <button
              className="calibration-btn"
              onClick={() => applyOffsetDelta(STEP_SMALL)}
            >
              +{STEP_SMALL}
            </button>
            <button
              className="calibration-btn"
              onClick={() => applyOffsetDelta(STEP_MEDIUM)}
            >
              +{STEP_MEDIUM}
            </button>
            <button
              className="calibration-btn"
              onClick={() => applyOffsetDelta(STEP_LARGE)}
            >
              +{STEP_LARGE}
            </button>
          </div>

          <div className="calibration-actions">
            <button
              className="calibration-btn secondary"
              onClick={handleResetScene}
              title="Quitar override de esta escena"
            >
              <FaUndo /> Reset escena
            </button>
            <button
              className="calibration-btn secondary"
              onClick={copyStoredOnly}
              title="Copia solo los offsets que ajustaste en este navegador"
            >
              <FaCopy /> Copiar JSON (calibrados)
            </button>
            <button
              className="calibration-btn secondary"
              onClick={copyAsCode}
              title="Copia un snippet listo para pegar en sceneCalibration.js"
            >
              <FaCopy /> Copiar como código
            </button>
          </div>

          <div className="calibration-footnote">
            Persistencia: se guarda en localStorage (solo este navegador).
            Para dejarlo fijo en el repo, pega el snippet en
            src/helpers/sceneCalibration.js.
          </div>
        </div>

        <div className="calibration-viewer">
          {hasValidSceneImage ? (
            <Pannellum
              width={"100%"}
              height={"100%"}
              image={String(scene.image).trim()}
              pitch={typeof scene.pitch === "number" ? scene.pitch : 0}
              yaw={typeof scene.yaw === "number" ? scene.yaw : 0}
              hfov={140}
              autoLoad
              showFullscreenCtrl={false}
              showZoomCtrl={false}
              compass={false}
              mouseZoom={true}
              doubleClickZoom={false}
              dragMode={1}
              ref={setPannellumRef}
              {...(previewImageForPannellum || {})}
            />
          ) : (
            <div className="calibration-noimage">
              <p className="calibration-noimage__title">
                Esta escena no tiene imagen 360° asignada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
