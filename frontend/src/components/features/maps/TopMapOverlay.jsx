import React, { useState } from "react";
import "./TopMapOverlay.css";
import {
  FaTimes,
  FaSitemap,
  FaMap,
  FaChevronDown,
  FaChevronRight,
  FaCompressAlt,
  FaExpandAlt,
  FaThumbtack,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";

function SceneNode({ scene, isActive, onGo }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="tm-scene">
      <button
        type="button"
        className={`tm-scene-btn ${isActive ? "active" : ""}`}
        onClick={() => onGo(scene.sceneKey)}
        title={`Ir a: ${scene.title}`}
      >
        <span className="tm-scene-btn__left">
          <span className={`tm-dot ${isActive ? "active" : ""}`} />
          <span className="tm-scene-btn__title">{scene.title}</span>
        </span>

        <span className="tm-scene-btn__right">
          <FaMapMarkerAlt />
        </span>
      </button>

      <button
        type="button"
        className="tm-scene-hotspots-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={open ? "Ocultar hotspots" : "Ver hotspots"}
      >
        {open ? <FaChevronDown /> : <FaChevronRight />}
        <span>Hotspots</span>
        <span className="tm-badge">{scene.hotSpots?.length || 0}</span>
      </button>

      {open && (
        <div className="tm-hotspots">
          {(scene.hotSpots || []).length ? (
            scene.hotSpots.map((h) => (
              <div key={`${scene.sceneKey}_${h.key}`} className="tm-hotspot-row">
                <span className="tm-hotspot-label" title={h.label}>
                  {h.label}
                </span>
                <span className="tm-hotspot-type" title={h.type}>
                  {h.type}
                </span>
              </div>
            ))
          ) : (
            <div className="tm-empty-small">Esta escena no tiene hotspots.</div>
          )}
        </div>
      )}
    </div>
  );
}

const TopMapOverlayView = ({
  project,
  onHotspotClick,
  currentSceneKey,
  onClose,
  mapHeading = 0,
  currentHfov = 140,
  safeProject,
  zonesTree,
  currentZoneId,
  allZones,
  selectedZoneId,
  effectiveZoneId,
  selectedZone,
  zoneName,
  planImage,
  hasPlan,
  activeTab,
  setActiveTab,
  isMinimized,
  setIsMinimized,
  isPinned,
  setIsPinned,
  query,
  setQuery,
  zoneOpen,
  dockRef,
  wrapperRef,
  imgRef,
  isNavigating,
  lastClicked,
  handleGoScene,
  selectZoneId,
  handleGoFirstSceneOfZone,
  filteredZones,
  imageRect,
  wrapperSize,
  updateRects,
  mapPoints,
  currentPoint,
  currentPx,
  cone,
  toggleZone,
  openDockAndTab,
  computePinPosition,
  hasProject,
}) => {
  if (!hasProject) return null;

  return (
    <div className={`tm-root ${isMinimized ? "is-minimized" : ""}`} aria-label="Mapa y Zonas">
      <div className="tm-rail" aria-hidden={false}>
        <button
          type="button"
          className={`tm-rail-btn ${activeTab === "zones" ? "active" : ""}`}
          onClick={() => openDockAndTab("zones")}
          title="Zonas"
          aria-label="Zonas"
        >
          <FaSitemap />
        </button>

        <button
          type="button"
          className={`tm-rail-btn ${activeTab === "map" ? "active" : ""}`}
          onClick={() => openDockAndTab("map")}
          title="Mapa"
          aria-label="Mapa"
        >
          <FaMap />
        </button>

        <div className="tm-rail-spacer" />

        {isMinimized ? (
          <button
            type="button"
            className="tm-rail-btn"
            onClick={() => setIsMinimized(false)}
            title="Abrir panel"
            aria-label="Abrir panel"
          >
            <FaExpandAlt />
          </button>
        ) : (
          <button
            type="button"
            className="tm-rail-btn"
            onClick={() => setIsMinimized(true)}
            title="Minimizar panel"
            aria-label="Minimizar panel"
          >
            <FaCompressAlt />
          </button>
        )}
      </div>

      <aside ref={dockRef} className="tm-dock" role="dialog" aria-modal="false" aria-hidden={isMinimized}>
        <div className="tm-dock-header">
          <div className="tm-dock-title">
            <span className="tm-dock-title__main">{activeTab === "zones" ? "Zonas" : "Mapa"}</span>
            <span className="tm-dock-title__sub">
              {activeTab === "zones"
                ? "Árbol de zonas · escenas · hotspots"
                : hasPlan
                ? `Plano de la zona: ${zoneName}`
                : "Sin plano cargado"}
            </span>
          </div>

          <div className="tm-actions">
            <button
              className={`tm-icon ${isPinned ? "active" : ""}`}
              onClick={() => setIsPinned((v) => !v)}
              title={isPinned ? "Panel fijado (clic para liberar)" : "Fijar panel"}
              aria-label="Fijar panel"
              type="button"
            >
              <FaThumbtack />
            </button>

            <button
              className="tm-icon"
              onClick={() => setIsMinimized(true)}
              title="Minimizar"
              aria-label="Minimizar"
              type="button"
            >
              <FaCompressAlt />
            </button>

            <button
              className="tm-close"
              onClick={onClose}
              title="Cerrar"
              aria-label="Cerrar"
              type="button"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {activeTab === "zones" && (
          <div className="tm-search">
            <FaSearch className="tm-search__icon" />
            <input
              className="tm-search__input"
              placeholder="Buscar zona, escena o hotspot…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
            />
            {query ? (
              <button
                type="button"
                className="tm-search__clear"
                onClick={() => setQuery("")}
                title="Limpiar"
              >
                ×
              </button>
            ) : null}
          </div>
        )}

        <div className="tm-content">
          {activeTab === "zones" && (
            <>
              {Object.keys(filteredZones).length ? (
                Object.entries(filteredZones).map(([zName, z]) => {
                  const open = zoneOpen[zName] ?? true;
                  const countScenes = z?.scenes?.length || 0;

                  return (
                    <div key={zName} className="tm-zone">
                      <button
                        type="button"
                        className="tm-zone-header"
                        onClick={() => toggleZone(zName)}
                        aria-expanded={open}
                        title={open ? "Contraer" : "Expandir"}
                      >
                        <span className="tm-zone-header__left">
                          {open ? <FaChevronDown /> : <FaChevronRight />}
                          <span className="tm-zone-header__title">{zName}</span>
                          <span className="tm-badge">{countScenes}</span>
                        </span>
                      </button>

                      {open && (
                        <div className="tm-zone-body">
                          {z.scenes.map((s) => (
                            <SceneNode
                              key={s.sceneKey}
                              scene={s}
                              isActive={currentSceneKey === s.sceneKey}
                              onGo={handleGoScene}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="tm-empty">
                  No hay resultados para <b>{query}</b>.
                </div>
              )}

              {isNavigating && (
                <div className="tm-toast" role="status" aria-live="polite">
                  Abriendo escena…{" "}
                  <b>{safeProject?.scenes?.[lastClicked]?.title || lastClicked}</b>
                </div>
              )}
            </>
          )}

          {activeTab === "map" && (
            <>
              {allZones.length > 1 && (
                <div className="tm-zones-switch" role="tablist" aria-label="Selector de zonas">
                  <div className="tm-zones-switch__label">Cambiar zona</div>
                  <div className="tm-zones-switch__chips">
                    {allZones.map(z => {
                      const zActive = (z.id === selectedZoneId) || (z.name === selectedZoneId);
                      return (
                        <button
                          type="button"
                          key={z.id}
                          className={`tm-zone-chip ${zActive ? "active" : ""}`}
                          role="tab"
                          aria-selected={zActive ? "true" : "false"}
                          onClick={() => {
                            if (zActive) return;
                            selectZoneId(z.id);
                            handleGoFirstSceneOfZone(z.id);
                          }}
                          title={`${z.name} · ${z.countScenes} escena${z.countScenes === 1 ? "" : "s"}${z.hasMap ? " · Plano cargado" : ""}`}
                        >
                          <span className="tm-zone-chip__name">{z.name}</span>
                          {z.countScenes ? (
                            <span className="tm-zone-chip__count">{z.countScenes}</span>
                          ) : null}
                          {z.hasMap ? (
                            <span className="tm-zone-chip__mapok" title="Tiene plano">🗺️</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!hasPlan ? (
                <div className="tm-warning">
                  No hay plano cargado en <b>el proyecto</b> para la zona <b>{zoneName}</b>.
                  <br />
                </div>
              ) : (
                <div ref={wrapperRef} className="tm-map">
                  <img
                    ref={imgRef}
                    src={planImage}
                    alt="Plano"
                    className="tm-map-img"
                    onLoad={() => requestAnimationFrame(updateRects)}
                    draggable={false}
                  />
                  {cone && (
                    <svg
                      className="tm-hfov"
                      width="100%"
                      height="100%"
                      viewBox={`0 0 ${wrapperSize.w} ${wrapperSize.h}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d={`M ${cone.p0.x} ${cone.p0.y} L ${cone.pL.x} ${cone.pL.y} L ${cone.pR.x} ${cone.pR.y} Z`}
                        fill="rgba(59, 130, 246, 0.14)"
                        stroke="rgba(59, 130, 246, 0.85)"
                        strokeWidth="2"
                      />
                      <line
                        x1={cone.p0.x}
                        y1={cone.p0.y}
                        x2={cone.pC.x}
                        y2={cone.pC.y}
                        stroke="rgba(59, 130, 246, 0.45)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />
                      <circle
                        cx={cone.p0.x}
                        cy={cone.p0.y}
                        r="6"
                        fill="#f97316"
                        stroke="#ffffff"
                        strokeWidth="3"
                      />
                    </svg>
                  )}
                  {mapPoints.map((p) => {
                    const { topPx, leftPx } = computePinPosition(p);
                    const isActive = currentSceneKey === p.sceneKey;
                    const isPending = isNavigating && lastClicked === p.sceneKey;

                    return (
                      <button
                        key={p.id}
                        className={`tm-pin ${isActive ? "active" : ""} ${isPending ? "pending" : ""}`}
                        style={{ top: `${topPx}px`, left: `${leftPx}px` }}
                        onClick={() => handleGoScene(p.sceneKey)}
                        title={p.title || p.sceneKey}
                        aria-label={p.title || p.sceneKey}
                        disabled={!p.sceneKey || isNavigating}
                        type="button"
                      />
                    );
                  })}
                </div>
              )}

              {isNavigating && (
                <div className="tm-toast" role="status" aria-live="polite">
                  Abriendo escena…{" "}
                  <b>{safeProject?.scenes?.[lastClicked]?.title || lastClicked}</b>
                </div>
              )}

              <div className="tm-hint">
                Tip: el cono representa el HFOV (hacia dónde “mira” el 360 en el plano).
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default TopMapOverlayView;
