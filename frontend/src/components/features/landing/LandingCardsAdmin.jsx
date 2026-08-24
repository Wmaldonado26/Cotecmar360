import React from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaHome, FaUsers, FaLock, FaLayerGroup, FaBars, FaArrowLeft } from 'react-icons/fa';
import DynamicNavbar from '../../layout/Navbar/DynamicNavbar';
import "../projects/ProjectManager/ProjectManager.css";
import "../users/UserManagement/UserManagement.css";
import "../../common/Modal/ConfirmModal.css";
import "./LandingCardsAdmin.css";
import cotecmarLogo from "../../../assets/images/logo.png";

const LandingCardsAdminView = (props) => {
  const {
    cards,
    loading,
    showSidebar,
    error,
    isEditing,
    currentCard,
    formData,
    selectedFile,
    handleOpenEdit,
    handleCloseEdit,
    handleSave,
    handleDelete,
    handleOverlayClick,
    handleSidebarClose,
    handleSidebarOpen,
    handleEditOverlayClick,
    handleEditModalStopPropagation,
    handleFormLayerChange,
    handleFormTitleChange,
    handleFormDescriptionChange,
    handleFormOrderChange,
    handleFormLinkChange,
    handleFileChange,
    handleSidebarProjectsClick,
    handleSidebarUsersClick,
    handleSidebarPermissionsClick,
    handleBackClick,
    getCardImageStyle,
  } = props;

  return (
    <div className="project-manager desktop-mode">
      <div 
        className={`sidebar-overlay ${showSidebar ? "active" : ""}`} 
        onClick={handleOverlayClick}
      ></div>

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
          <button className="sidebar-item" onClick={handleSidebarProjectsClick}>
            <FaHome className="sidebar-icon" />
            <span>Mis Proyectos</span>
          </button>
          
          <button className="sidebar-item" onClick={handleSidebarUsersClick}>
            <FaUsers className="sidebar-icon" />
            <span>Gestión de Usuarios</span>
          </button>
          
          <button className="sidebar-item" onClick={handleSidebarPermissionsClick}>
            <FaLock className="sidebar-icon" />
            <span>Permisos y Roles</span>
          </button>

          <button className="sidebar-item active">
            <FaLayerGroup className="sidebar-icon" />
            <span>Tarjetas Landing</span>
          </button>
        </nav>
      </div>

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

      <div className="landingcardsadmin__back-container">
        <button 
          onClick={handleBackClick} 
          className="back-btn-cotecmar"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <main className="dashboard-content landingcardsadmin__dashboard-content" role="main">
        <div className="projects-section landingcardsadmin__projects-section">
          <div className="projects-header">
            <div className="projects-header-title">
              <h2>Tarjetas de Presentación</h2>
            </div>
            <div className="projects-header-actions">
              <button className="btn-primary" onClick={() => handleOpenEdit()}>
                <FaPlus /> Nueva Tarjeta
              </button>
            </div>
          </div>

          {error && <div className="error-message landingcardsadmin__error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-state">Cargando tarjetas...</div>
          ) : (
            <div className="landing-cards-grid">
              {cards.map((card) => (
                <div key={card.id} className="landing-card-item">
                  <div className="project-card-image landingcardsadmin__card-image" style={getCardImageStyle(card)}>
                  </div>
                  <div className="project-card-content">
                    <span className="project-type">Orden: {card.orderIndex}</span>
                    <h3 className="project-title" title={card.title}>{card.title}</h3>
                    <p className="project-description" title={card.description}>{card.description}</p>
                  </div>
                  <div className="project-card-actions">
                    <button className="btn-action primary" onClick={() => handleOpenEdit(card)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="btn-action danger" onClick={() => handleDelete(card.id)}>
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {isEditing && (
        <div className="confirm-modal-overlay" onClick={handleEditOverlayClick}>
          <div className="confirm-modal landingcardsadmin__edit-modal" onClick={handleEditModalStopPropagation}>
            <button className="modal-close-btn" onClick={handleCloseEdit}>
              <FaTimes />
            </button>
            <div className="modal-header landingcardsadmin__edit-modal-header">
              <h2 className="landingcardsadmin__edit-modal-title">
                {currentCard ? "Editar Tarjeta" : "Nueva Tarjeta"}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="user-form">
              <label>
                Capa (Ej. 01)
                <input 
                  type="text" 
                  value={formData.layer} 
                  onChange={handleFormLayerChange} 
                  required
                  placeholder="01"
                />
              </label>
              <label>
                Título
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={handleFormTitleChange} 
                  required
                  placeholder="Título de la tarjeta"
                />
              </label>
              <label>
                Descripción
                <textarea 
                  value={formData.description} 
                  onChange={handleFormDescriptionChange} 
                  required
                  placeholder="Describe el contenido..."
                  className="landingcardsadmin__form-textarea"
                />
              </label>
              <label>
                Orden (Número)
                <input 
                  type="number" 
                  value={formData.orderIndex} 
                  onChange={handleFormOrderChange} 
                  placeholder="0"
                />
              </label>
              <label>
                Enlace (URL del tour)
                <input 
                  type="text" 
                  value={formData.link} 
                  onChange={handleFormLinkChange} 
                  placeholder="https://ejemplo.com"
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
              
              <div className="landingcardsadmin__form-actions">
                <button type="button" className="secondary-btn" onClick={handleCloseEdit}>
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  <FaSave className="landingcardsadmin__submit-icon" /> Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingCardsAdminView;
