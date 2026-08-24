import React from "react";
import { FaTimes, FaFileDownload } from "react-icons/fa";
import "./InfoSidebar.css";

const InfoSidebarView = (props) => {
  const {
    content,
    shouldRender,
    handleOverlayClick,
    handleSidebarClick,
    handleDownloadPDF,
  } = props;

  if (!shouldRender) return null;

  return (
    <div className="info-sidebar-overlay" onClick={handleOverlayClick}>
      <aside className="info-sidebar" onClick={handleSidebarClick}>
        <header className="info-sidebar-header">
          <h3>{content.title}</h3>
          <button className="close-btn" onClick={handleOverlayClick}>
            <FaTimes />
          </button>
        </header>

        <div className="info-sidebar-content">
          {content.image && (
            <div className="info-image-container">
              <img
                src={content.image}
                alt={content.title}
                className="info-image"
              />
            </div>
          )}

          {content.description && (
            <div className="info-description">
              <p>{content.description}</p>
            </div>
          )}

          {content.specifications && (
            <div className="info-specifications">
              <h4>Especificaciones Técnicas</h4>
              <ul>
                {content.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {content.pdfUrl && (
            <div className="info-download">
              <button className="download-btn" onClick={handleDownloadPDF}>
                <FaFileDownload /> Descargar PDF
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default InfoSidebarView;
