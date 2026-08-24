import React from "react";
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import DynamicNavbar from "../../layout/Navbar/DynamicNavbar";
import "./PagesInformations.css";

const PagesInformationsView = (props) => {
  const {
    ship,
    idx,
    mounted,
    specTrackRef,
    categories,
    filteredAttachments,
    attachmentCategory,
    setAttachmentCategory,
    prev,
    next,
    scrollSpecs,
    handleBack,
    handleThumbClick,
    handleSpecCardKeyDown,
    handleSpecCardClick,
    isSpecExpanded,
  } = props;

  return (
    <div className="pi-page">
      <header className="pi-header">
        <DynamicNavbar
          showBackButton={false}
          darkMode={false}
          onToggleDarkMode={() => {}}
          scenes={{}}
          currentScene={null}
          onSceneSelect={() => {}}
        />
        
        <div className="pagesinformations__back-container">
          <button 
            onClick={handleBack} 
            className="back-btn-cotecmar"
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
      </header>

      <main className="pi-container">
        <div className={`pi-card ${mounted ? "pi-entered" : "pi-entering"}`}>
          <section className="pi-left">
            <div className="pi-hero">
              <img
                className="pi-hero-img"
                src={ship.gallery[idx].src}
                alt={ship.gallery[idx].title || `img-${idx}`}
              />

              <button
                className="pi-nav pi-nav-left"
                onClick={prev}
                type="button"
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                className="pi-nav pi-nav-right"
                onClick={next}
                type="button"
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="pi-thumbs">
              {ship.gallery.map((img, index) => (
                <button
                  key={img.id}
                  className={`pi-thumb ${index === idx ? "active" : ""}`}
                  onClick={() => handleThumbClick(index)}
                  type="button"
                  aria-label={`mini-${index}`}
                >
                  <img src={img.src} alt={img.title || `thumb-${index}`} />
                </button>
              ))}
            </div>

            <div className="pi-dots" aria-hidden="true">
              {ship.gallery.map((_, index) => (
                <span
                  key={index}
                  className={`pi-dot ${index === idx ? "active" : ""}`}
                />
              ))}
            </div>
          </section>

          <section className="pi-right">
            <h1 className="pi-title">{ship.name}</h1>
            <p className="pi-desc">{ship.description}</p>

            <div className="pi-tags">
              {ship.tags.map((tag, index) => (
                <span className="pi-tag" key={index}>
                  <span className="pi-tag-ico">{tag.icon}</span>
                  {tag.label}
                </span>
              ))}
            </div>
          </section>

          <section className="pi-tech pi-tech--full">
            <h2 className="pi-subtitle">Especificaciones Tecnicas</h2>

            <div className="pi-highlight">
              {ship.highlights.map((highlight) => (
                <div className="pi-hi" key={highlight.label}>
                  <div className="pi-hi-value">{highlight.value}</div>
                  <div className="pi-hi-label">{highlight.label}</div>
                </div>
              ))}
            </div>

            <h2 className="pi-subtitle pagesinformations__subtitle--spaced">
              Caracteristicas
            </h2>

            <div className="pi-spec-carousel">
              <button
                type="button"
                className="pi-spec-arrow pi-spec-arrow--left"
                onClick={() => scrollSpecs(-1)}
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>

              <div className="pi-spec-track" ref={specTrackRef}>
                {Object.entries(ship.specs).map(([group, rows]) => {
                  const isExpanded = isSpecExpanded(group);

                  return (
                    <div
                      className={`pi-spec-card ${isExpanded ? "expanded" : ""}`}
                      key={group}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={() => handleSpecCardClick(group)}
                      onKeyDown={(event) => handleSpecCardKeyDown(event, group)}
                    >
                      <div className="pi-spec-title">{group}</div>
                      <div className="pi-spec-rows">
                        {rows.map((row, rowIndex) => (
                          <div className="pi-spec-row" key={`${group}-${row.k}-${rowIndex}`}>
                            <span className="pi-spec-k">{row.k}</span>
                            <span className="pi-spec-v">{row.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="pi-spec-arrow pi-spec-arrow--right"
                onClick={() => scrollSpecs(1)}
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>
            </div>
          </section>

          <section className="pi-attachments pi-attachments--full">
            <div className="pi-att-head">
              <h2 className="pi-subtitle pagesinformations__subtitle--nomargin">
                Archivos adjuntos
              </h2>

              <div className="pi-att-tabs" role="tablist" aria-label="Categorias">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`pi-att-tab ${attachmentCategory === category ? "active" : ""}`}
                    onClick={() => setAttachmentCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="pi-att-table" role="table" aria-label="Tabla de adjuntos">
              <div className="pi-att-row pi-att-row--head" role="row">
                <div className="pi-att-cell pi-att-title" role="columnheader">
                  Documento
                </div>
                <div className="pi-att-cell pi-att-meta" role="columnheader">
                  Detalles
                </div>
                <div className="pi-att-cell pi-att-actions" role="columnheader">
                  Acciones
                </div>
              </div>

              {filteredAttachments.length === 0 ? (
                <div className="pi-att-empty">No hay archivos en esta categoria.</div>
              ) : (
                filteredAttachments.map((attachment, index) => (
                  <div
                    key={attachment.id || `${attachment.title}-${index}`}
                    className="pi-att-row"
                    role="row"
                  >
                    <div className="pi-att-cell pi-att-title" role="cell">
                      <div className="pi-att-doc">
                        <div className="pi-att-doc-title">{attachment.title}</div>
                        <div className="pi-att-doc-desc">{attachment.description}</div>
                        <div className="pi-att-doc-chip">
                          <span className="pi-att-chip">{attachment.category}</span>
                          <span className="pi-att-chip">{attachment.format}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pi-att-cell pi-att-meta" role="cell">
                      <div className="pi-att-meta-grid">
                        <div className="pi-att-meta-item">
                          <span className="pi-att-meta-k">Tamano</span>
                          <span className="pi-att-meta-v">{attachment.size}</span>
                        </div>
                        <div className="pi-att-meta-item">
                          <span className="pi-att-meta-k">Actualizacion</span>
                          <span className="pi-att-meta-v">{attachment.updatedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pi-att-cell pi-att-actions" role="cell">
                      <a
                        className="pi-att-btn pi-att-btn--ghost"
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver
                      </a>
                      <a className="pi-att-btn" href={attachment.url} download={attachment.title}>
                        Descargar
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="pi-footer">
          <span>Powered by</span>
          <strong className="pagesinformations__footer-strong">COTECMAR</strong>
        </div>
      </main>
    </div>
  );
};

export default PagesInformationsView;
