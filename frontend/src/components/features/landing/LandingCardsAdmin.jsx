import React from "react";
import DynamicNavbar from "../../layout/Navbar/DynamicNavbar";
import { FaBars, FaTimes, FaPlus, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import cotecmarLogo from "../../../assets/images/cotecmar-logo.png";
import useLandingCardsAdminLogic from "./LandingCardsAdmin.logic";
import "./LandingCardsAdmin.css";

export default function LandingCardsAdminView(props) {
  const {
    currentUser,
    cards,
    loading,
    error,
    showSidebar,
    isEditing,
    currentCard,
    formData,
    formLanguage,
    selectedFile,
    isTranslating,
    translateMessage,
    translateError,
    handleSidebarOpen,
    handleSidebarClose,
    handleOpenEdit,
    handleCloseEdit,
    handleEditModalStopPropagation,
    handleFormLayerChange,
    handleFormTitleChange,
    handleFormDescriptionChange,
    handleFormLanguageChange,
    handleRefreshTranslation,
    handleFormOrderChange,
    handleFormLinkChange,
    handleFileChange,
    handleSaveCard,
    handleDeleteCard,
  } = useLandingCardsAdminLogic(props);

  return (
    <div className="landingcardsadmin">
      <div className="landingcardsadmin__layout">
        {/* Sidebar */}
        <div className={`sidebar-menu ${showSidebar ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand-title">
              <img src={cotecmarLogo} alt="COTECMAR" className="sidebar-logo" />
              <span>Navegación</span>
            </div>
            <button 
              className="sidebar-close-btn" 
              onClick={handleSidebarClose} 
              title="Cerrar Menú"
            >
              <FaTimes />
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/admin/projects">Proyectos 360</a></li>
              <li className="active"><a href="/admin/landing">Landing Page</a></li>
              {currentUser?.role === 'admin' && (
                <li><a href="/admin/users">Gestión de Usuarios</a></li>
              )}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="landingcardsadmin__main">
          <DynamicNavbar
            showBackButton={false}
            title="Gestión de Tarjetas"
            subtitle="Landing Page - XR Lab"
            leftActions={
              <button 
                className="hamburger-btn landingcardsadmin__hamburger-btn" 
                onClick={handleSidebarOpen}
                title="Abrir Menú"
              >
                <FaBars />
              </button>
            }
          />

          <div className="projects-section landingcardsadmin__projects-section">
            <div className="projects-header">
              <div className="projects-header-title">
                <h2>Tarjetas de Presentación</h2>
                <p>Configura las tarjetas que aparecen en la página principal.</p>
              </div>
              <button className="btn-primary" onClick={() => handleOpenEdit()}>
                <FaPlus /> Nueva Tarjeta
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading && !isEditing ? (
              <div className="loading-spinner">Cargando tarjetas...</div>
            ) : (
              <div className="projects-grid">
                {cards.map(card => (
                  <article key={card.id} className="project-card">
                    {card.imagePath && (
                      <div className="project-card-image" style={{ backgroundImage: `url(${card.imagePath})` }} />
                    )}
                    <div className="project-card-content">
                      <span className="project-type">Orden: {card.orderIndex}</span>
                      <h3 className="project-title" title={card.title}>{card.title}</h3>
                      <p className="project-description" title={card.description}>{card.description}</p>
                      {(!card.titleEn || !card.descriptionEn) && (
                        <span className="badge badge-warning" style={{marginTop: '10px', display: 'inline-block', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: '#fef08a', color: '#854d0e'}}>Traducción pendiente</span>
                      )}
                    </div>
                    <div className="project-card-actions">
                      <button className="btn-secondary btn-secondary--sm" onClick={() => handleOpenEdit(card)}>
                        <FaEdit /> Editar
                      </button>
                      <button className="btn-danger btn-danger--sm" onClick={(e) => handleDeleteCard(card.id, e)}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-content landingcardsadmin__edit-modal" onClick={handleEditModalStopPropagation}>
            <form onSubmit={handleSaveCard}>
              <div className="modal-header landingcardsadmin__edit-modal-header">
                <h2 className="landingcardsadmin__edit-modal-title">
                  {currentCard ? "Editar Tarjeta" : "Nueva Tarjeta"}
                </h2>
                <button type="button" className="close-btn" onClick={handleCloseEdit}><FaTimes /></button>
              </div>
              
              <div className="modal-body landingcardsadmin__edit-modal-body">
                <label>
                  Capa (Ej. 01)
                  <input 
                    type="text" 
                    value={formData.layer} 
                    onChange={handleFormLayerChange} 
                    required
                  />
                </label>

                <div className="translation-section" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                    <label style={{ margin: 0 }}>
                      Idioma del contenido
                      <select 
                        value={formLanguage} 
                        onChange={handleFormLanguageChange}
                        style={{ display: 'block', width: '200px', marginTop: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                      </select>
                    </label>
                    <button 
                      type="button" 
                      onClick={handleRefreshTranslation} 
                      disabled={isTranslating}
                      className="btn-secondary btn-secondary--sm"
                    >
                      <FaSyncAlt className={isTranslating ? 'spin' : ''} /> Actualizar traducción
                    </button>
                  </div>

                  <label>
                    Título
                    <input 
                      type="text" 
                      value={formLanguage === 'es' ? formData.title : formData.titleEn} 
                      onChange={handleFormTitleChange} 
                      required
                      placeholder="Título de la tarjeta"
                    />
                  </label>
                  
                  <label>
                    Descripción
                    <textarea 
                      value={formLanguage === 'es' ? formData.description : formData.descriptionEn} 
                      onChange={handleFormDescriptionChange} 
                      required
                      placeholder="Describe el contenido..."
                      className="landingcardsadmin__form-textarea"
                    />
                  </label>

                  {translateMessage && (
                    <div style={{ marginTop: '10px', fontSize: '13px', color: translateError ? '#dc2626' : '#16a34a' }}>
                      {translateMessage}
                    </div>
                  )}
                </div>

                <label>
                  Orden (Número)
                  <input 
                    type="number" 
                    value={formData.orderIndex} 
                    onChange={handleFormOrderChange} 
                  />
                </label>
                
                <label>
                  Enlace (URL del tour)
                  <input 
                    type="text" 
                    value={formData.link} 
                    onChange={handleFormLinkChange} 
                  />
                </label>
                
                <label>
                  Imagen (jpg, png)
                  <div className="landingcardsadmin__file-input-container">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="landingcardsadmin__file-input"
                    />
                    {selectedFile && <span className="landingcardsadmin__file-selected">¡Archivo seleccionado!</span>}
                  </div>
                </label>
              </div>

              <div className="modal-footer landingcardsadmin__edit-modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseEdit}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading || isTranslating}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
