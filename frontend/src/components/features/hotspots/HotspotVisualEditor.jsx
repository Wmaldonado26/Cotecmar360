import React from "react";
import "./HotspotVisualEditor.css";

export default function HotspotVisualEditorView(props) {
  const {
    viewerRef,
    hotspots,
    selectedHotspot,
    editingHotspot,
    placementMode,
    uploadingSceneImage,
    sceneImageUrl,
    sidebarOpen,
    scene,
    sceneKey,
    allScenes,
    attachmentsSearch,
    uploadingCoverMap,
    hotspotCount,
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
    FaImage,
    FaCamera,
    FaUpload,
    FaSearchMinus,
    FaSearchPlus,
    FaUndoAlt,
    FaMapPin,
    FaInfoCircle,
    FaShip,
    FaGripVertical,
    FaAngleLeft,
    FaAngleRight,
  } = props;
  
  const [sceneSearch, setSceneSearch] = React.useState("");
  const [isSceneDropdownOpen, setIsSceneDropdownOpen] = React.useState(false);

  return (
    <main
      className={`hotspot-visual-editor ${
        placementMode ? "placement-active" : ""
      } ${!sidebarOpen ? "sidebar-closed" : ""}`}
    >
      <section className="viewer-section">
        {sceneImageUrl ? (
          <>
            <div ref={viewerRef} className="pannellum-viewer" />
            <div className="viewer-vignette" aria-hidden="true" />
            {placementMode && (
              <div className="placement-overlay" aria-hidden="true">
                <div className="placement-overlay__text">
                  <FaCrosshairs size={18} />
                  Haz clic para colocar aquí
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-image-state">
            <div className="no-image-icon">
              <FaCamera size={48} />
            </div>
            <div className="no-image-copy">
              <h3>Esta escena no tiene imagen 360°</h3>
              <p>
                Sube primero la imagen equirectangular de la escena para poder
                visualizarla y colocar hotspots donde quieras.
              </p>
            </div>
            <label className="btn-upload-hero">
              {uploadingSceneImage ? (
                "Subiendo imagen..."
              ) : (
                <>
                  <FaUpload /> Subir imagen 360°
                </>
              )}
              <input
                className="u-hidden"
                type="file"
                accept="image/*"
                onChange={handleSceneImageUpload}
                disabled={uploadingSceneImage}
              />
            </label>
          </div>
        )}
      </section>

      <div className="ui-layer">
        <header className="visual-editor-controls">
          <div className="controls-left">
            <div className="title-stack">
              <div className="title-row">
                <FaMapPin className="title-icon" />
                <h2>Editor Visual</h2>
                {placementMode && (
                  <span className="badge badge--warning">
                    <FaCrosshairs /> Modo ubicación
                  </span>
                )}
              </div>
              <div className="subtitle-row">
                <span className="badge badge--primary">
                  <FaShip /> {formatSceneName(scene.title, sceneKey)}
                </span>
              </div>
            </div>
          </div>

          <nav className="controls-center">
            {sceneImageUrl && (
              <div className="viewer-inline-controls">
                <button
                  type="button"
                  className="btn-icon-subtle"
                  onClick={() => handleZoom(-1)}
                  title="Zoom in"
                >
                  <FaSearchPlus />
                </button>
                <button
                  type="button"
                  className="btn-icon-subtle"
                  onClick={() => handleZoom(1)}
                  title="Zoom out"
                >
                  <FaSearchMinus />
                </button>
                <div className="divider-v" />
                <button
                  type="button"
                  className="btn-text-subtle"
                  onClick={handleResetView}
                  title="Restablecer vista inicial"
                >
                  <FaUndoAlt /> Reset
                </button>
              </div>
            )}
            <button
              type="button"
              className={`btn-primary ${
                placementMode ? "btn-primary--active" : ""
              }`}
              onClick={handleTogglePlacementMode}
            >
              <FaPlus />
              {placementMode ? "Cancelar (ESC)" : "Agregar Hotspot"}
            </button>
          </nav>

          <div className="controls-right">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleToggleSidebar}
              title="Alternar panel"
            >
              {sidebarOpen ? <FaAngleRight /> : <FaAngleLeft />} Panel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              title="Guardar cambios"
            >
              <FaSave /> Guardar
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={onClose}
              title="Cerrar editor"
            >
              <FaTimes /> Cerrar
            </button>
          </div>
        </header>

        {placementMode && (
          <div className="placement-banner">
            <div className="placement-banner__icon">
              <FaCrosshairs />
            </div>
            <div className="placement-banner__text">
              <strong>Modo ubicación activo</strong>
              <span>
                Haz clic en cualquier parte de la imagen 360° para colocar el
                nuevo hotspot. Presiona ESC o "Cancelar" para salir.
              </span>
            </div>
            <button
              type="button"
              className="btn-outline-warning"
              onClick={() => setPlacementMode(false)}
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        )}

        <div className="ui-body">
          <aside
            className={`hotspot-sidebar ${sidebarOpen ? "open" : "closed"}`}
          >
            <header className="sidebar-header">
              <div className="sidebar-header__row">
                <h3>
                  <FaMapPin className="sidebar-header__icon" /> Hotspots
                  <span className="badge-count">{hotspotCount}</span>
                </h3>
                {hotspotCount > 0 && !placementMode && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setPlacementMode(true)}
                  >
                    <FaPlus /> Nuevo
                  </button>
                )}
              </div>
            </header>

            <div className="hotspot-list">
              {Object.entries(hotspots).map(([key, hotspot]) => {
                const meta =
                  HOTSPOT_TYPE_META[hotspot.cssClass] ||
                  HOTSPOT_TYPE_META.moveScene;
                const { Icon } = meta;
                const isNav = hotspot.cssClass === "moveScene";
                const isInfo = hotspot.cssClass === "infoHotspot";
                const isElement = hotspot.cssClass === "hotSpotElement";
                const attachments = Array.isArray(hotspot.attachments)
                  ? hotspot.attachments
                  : [];
                const sceneMatch =
                  isNav && hotspot.scene && allScenes?.[hotspot.scene];
                const search = (attachmentsSearch[key] || "").toLowerCase();
                const filteredAtts = attachments.filter(
                  (a) =>
                    !search ||
                    String(a.originalName || a.filename || "")
                      .toLowerCase()
                      .includes(search) ||
                    String(a.folder || "").toLowerCase().includes(search)
                );

                return (
                  <article
                    key={key}
                    className={`hotspot-card ${
                      selectedHotspot === key ? "is-selected" : ""
                    }`}
                  >
                    <header
                      className="hotspot-card__header"
                      onClick={() => handleSelectHotspot(key)}
                    >
                      <div
                        className="hotspot-card__grip"
                        onMouseDown={(e) => e.stopPropagation()}
                        title="Orden visual"
                      >
                        <FaGripVertical />
                      </div>
                      <div className="hotspot-card__content">
                        <div className="hotspot-card__info">
                          <div className="hotspot-card__title">
                            {hotspot.label || hotspot.title || "Sin etiqueta"}
                          </div>
                          {editingHotspot !== key && (
                            <div className="hotspot-card__details">
                              <span className={`hotspot-card__type hotspot-card__type--${hotspot.cssClass}`}>
                                <Icon size={12} /> {meta.label}
                              </span>
                              {isNav ? (
                                <span className={`hotspot-card__note ${sceneMatch ? "hotspot-card__note--valid" : "hotspot-card__note--missing"}`}>
                                  {sceneMatch ? <><FaShip size={10} /> {formatSceneName(sceneMatch.title, hotspot.scene)}</> : <><FaInfoCircle size={10} /> Sin destino</>}
                                </span>
                              ) : isInfo ? (
                                <span className="hotspot-card__note">
                                  {hotspot.title || hotspot.description ? "Información configurada" : "Sin información"}
                                </span>
                              ) : (
                                <span className="hotspot-card__note">
                                  {attachments.length} anexo{attachments.length !== 1 ? "s" : ""}
                                </span>
                              )}
                              <span className="hotspot-card__coords">
                                P: {Number(hotspot.pitch || 0).toFixed(1)}° | Y: {Number(hotspot.yaw || 0).toFixed(1)}°
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="hotspot-card__actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="btn-card-action"
                          onClick={() => handleDuplicateHotspot(key)}
                          title="Duplicar"
                        >
                          <FaSave size={12} />
                        </button>
                        <button
                          type="button"
                          className={`btn-card-action ${
                            editingHotspot === key ? "is-active" : ""
                          }`}
                          onClick={() => handleToggleEditingHotspot(key)}
                          title="Editar"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          className="btn-card-action btn-card-action--danger"
                          onClick={() => handleDeleteHotspot(key)}
                          title="Eliminar"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </header>

                    {editingHotspot === key && (
                      <div className="hotspot-editor">
                        <div className="hotspot-editor-section">
                          <h4 className="hotspot-editor-section__title">CONFIGURACIÓN</h4>
                          <div className="form-group">
                            <label>Tipo de Hotspot</label>
                            <div className="type-switcher">
                              {Object.entries(HOTSPOT_TYPE_META).map(([k, m]) => {
                                const active = (hotspot.cssClass || "moveScene") === k;
                                return (
                                  <button
                                    key={k}
                                    type="button"
                                    className={`type-switch hotspot-type--${k} ${active ? "is-active" : ""}`}
                                    onClick={() => handleUpdateHotspot(key, "cssClass", k)}
                                    title={m.hint}
                                  >
                                    <m.Icon size={14} className="type-switch__icon" /> {m.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Etiqueta flotante (Tooltip al pasar el mouse)</label>
                            <input
                              type="text"
                              value={hotspot.label || ""}
                              onChange={(e) => handleUpdateHotspot(key, "label", e.target.value)}
                              placeholder={isNav ? "Ej: Ir a la Sala de Máquinas" : "Ej: Ver detalles"}
                            />
                          </div>

                          {(isInfo || isElement) && (
                            <div className="form-group">
                              <label>Título principal (Dentro del panel)</label>
                              <input
                                type="text"
                                value={hotspot.title || ""}
                                onChange={(e) => handleUpdateHotspot(key, "title", e.target.value)}
                                placeholder="Ej: Motor Principal"
                              />
                            </div>
                          )}
                        </div>

                        {isNav && (
                          <div className="hotspot-editor-section">
                            <h4 className="hotspot-editor-section__title">NAVEGACIÓN</h4>
                            <div className="form-group">
                              <label>Escena destino</label>
                              <div className="custom-scene-select">
                                <div 
                                  className="custom-scene-select__header" 
                                  onClick={() => setIsSceneDropdownOpen(!isSceneDropdownOpen)}
                                >
                                  {hotspot.scene && sceneEntries.find(([sk]) => sk === hotspot.scene) 
                                    ? formatSceneName(sceneEntries.find(([sk]) => sk === hotspot.scene)[1].title, hotspot.scene) 
                                    : "Seleccionar escena destino..."}
                                  <span className={`custom-scene-select__icon ${isSceneDropdownOpen ? 'open' : ''}`}>▼</span>
                                </div>
                                {isSceneDropdownOpen && (
                                  <div className="custom-scene-select__dropdown">
                                    <div className="scene-search-wrapper">
                                      <input 
                                        type="text" 
                                        placeholder="🔍 Buscar escena..." 
                                        value={sceneSearch} 
                                        onChange={(e) => setSceneSearch(e.target.value)} 
                                        className="scene-search-input" 
                                        autoFocus
                                      />
                                    </div>
                                    <div className="custom-scene-select__options">
                                      {sceneEntries
                                        .filter(([sk, sc]) => formatSceneName(sc.title, sk).toLowerCase().includes(sceneSearch.toLowerCase()))
                                        .map(([sk, sc]) => (
                                          <div 
                                            key={sk} 
                                            className={`custom-scene-select__option ${hotspot.scene === sk ? 'selected' : ''}`}
                                            onClick={() => {
                                              handleUpdateHotspot(key, "scene", sk);
                                              setIsSceneDropdownOpen(false);
                                            }}
                                          >
                                            {formatSceneName(sc.title, sk)}
                                          </div>
                                      ))}
                                      {sceneEntries.filter(([sk, sc]) => formatSceneName(sc.title, sk).toLowerCase().includes(sceneSearch.toLowerCase())).length === 0 && (
                                        <div className="custom-scene-select__option disabled">
                                          No se encontraron escenas
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {isInfo && (
                          <div className="hotspot-editor-section">
                            <h4 className="hotspot-editor-section__title">CONTENIDO</h4>
                            <div className="form-group">
                              <label>Descripción / Contenido</label>
                              <textarea
                                value={hotspot.description || ""}
                                onChange={(e) => handleUpdateHotspot(key, "description", e.target.value)}
                                rows={4}
                                placeholder="Escribe la información que verá el usuario aquí..."
                              />
                            </div>
                            <div className="form-group">
                              <div className="cover-action-row">
                                <label className="cover-action-row__label">Imagen de portada (Tarjeta informativa)</label>
                                <label className="btn-secondary btn-secondary--sm">
                                  <FaCamera /> Subir imagen
                                  <input
                                    className="u-hidden"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleHotspotCoverUpload(key, e)}
                                    disabled={uploadingCoverMap[key]}
                                  />
                                </label>
                              </div>

                              {hotspot.coverImage ? (
                                <div className="hotspot-cover-preview">
                                  <div className="hotspot-cover-preview__img-wrap">
                                    <img className="hotspot-cover-preview__img" src={hotspot.coverImage} alt="Portada" />
                                  </div>
                                  <div className="hotspot-cover-preview__badge-wrap">
                                    <div className="hotspot-cover-preview__badge">{hotspot.title || "Vista previa"}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveHotspotCover(key)}
                                    className="hotspot-cover-preview__remove"
                                    title="Quitar portada"
                                  >
                                    <FaTimes size={12} />
                                  </button>
                                </div>
                              ) : (
                                <div className="hotspot-cover-empty">
                                  {uploadingCoverMap[key] ? (
                                    <p className="hotspot-cover-empty__text">Subiendo imagen...</p>
                                  ) : (
                                    <>
                                      <FaImage size={28} className="hotspot-cover-empty__icon" />
                                      <p className="hotspot-cover-empty__text">Sin imagen de portada. Sube una foto para que aparezca como cabecera en el modal informativo con estilo de tarjeta.</p>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {isElement && (
                          <div className="hotspot-editor-section">
                            <h4 className="hotspot-editor-section__title">ANEXOS</h4>
                            <div className="form-group">
                              <div className="cover-action-row">
                                <label>Anexos</label>
                                <label className="btn-secondary btn-secondary--sm">
                                  <FaPaperclip /> Subir
                                  <input
                                    className="u-hidden"
                                    type="file"
                                    accept="image/*,application/pdf,video/*"
                                    multiple
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || []);
                                      handleHotspotAttachmentsBulkUpload(key, files);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>

                              {attachments.length > 0 && (
                                <input
                                  type="text"
                                  className="u-mt-8"
                                  placeholder="Filtrar anexos..."
                                  value={attachmentsSearch[key] || ""}
                                  onChange={(e) => handleAttachmentsSearchChange(key, e.target.value)}
                                />
                              )}

                              {filteredAtts.map((att, idx) => {
                                const realIdx = attachments.indexOf(att);
                                return (
                                  <div key={idx} className="hotspot-att-row">
                                    <div className="hotspot-att-row__top">
                                      <strong className="hotspot-att-row__filename">{att.originalName || att.filename}</strong>
                                      <button type="button" className="btn-text-subtle" onClick={() => handleRemoveHotspotAttachment(key, realIdx)}>Quitar</button>
                                    </div>
                                    <input
                                      type="text"
                                      className="hotspot-att-row__folder-input"
                                      value={att.folder || ""}
                                      onChange={(e) => handleUpdateHotspotAttachmentFolder(key, realIdx, e.target.value)}
                                      placeholder="Carpeta (Ej: Motor/Manuales)"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {!isInfo && (
                          <div className="hotspot-editor-section">
                            <h4 className="hotspot-editor-section__title">POSICIÓN</h4>
                            <div className="editor-grid editor-grid--2">
                              <div className="form-group">
                                <label>Pitch (Vertical)</label>
                                <div className="coord-input-row">
                                  <input
                                    type="number"
                                    value={hotspot.pitch}
                                    step="0.1"
                                    onChange={(e) => handleUpdateHotspot(key, "pitch", parseFloat(e.target.value))}
                                  />
                                  <button
                                    type="button"
                                    className="coord-btn"
                                    onClick={() => {
                                      if (props.pannellumRef.current) {
                                        try { handleUpdateHotspot(key, "pitch", Number(props.pannellumRef.current.getPitch().toFixed(3))); } catch {}
                                      }
                                    }}
                                    title="Usar pitch actual"
                                  >
                                    📍
                                  </button>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Yaw (Horizontal)</label>
                                <div className="coord-input-row">
                                  <input
                                    type="number"
                                    value={hotspot.yaw}
                                    step="0.1"
                                    onChange={(e) => handleUpdateHotspot(key, "yaw", parseFloat(e.target.value))}
                                  />
                                  <button
                                    type="button"
                                    className="coord-btn"
                                    onClick={() => {
                                      if (props.pannellumRef.current) {
                                        try { handleUpdateHotspot(key, "yaw", Number(props.pannellumRef.current.getYaw().toFixed(3))); } catch {}
                                      }
                                    }}
                                    title="Usar yaw actual"
                                  >
                                    📍
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="editor-actions-row">
                          <button type="button" className="btn-primary" onClick={() => setEditingHotspot(null)}>
                            <FaCheck /> Listo
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}

              {Object.keys(hotspots).length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaCrosshairs />
                  </div>
                  <div className="empty-title">Sin hotspots</div>
                  <div className="empty-sub">
                    Comienza agregando puntos de interés a tu escena.
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setPlacementMode(true)}
                  >
                    <FaPlus /> Agregar
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
