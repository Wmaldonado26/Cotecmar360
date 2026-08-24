import React from "react";
import { FaArrowLeft, FaMoon, FaSun, FaUserShield, FaSignOutAlt, FaUserCircle, FaChevronDown, FaChevronRight, FaImages, FaKey, FaMapMarkerAlt, FaUserEdit } from "react-icons/fa";
import MapModal from "../../features/maps/MapModal";
import PasswordSettings from "../../features/auth/PasswordSettings";
import ProfileSettings from "../../features/auth/ProfileSettings";
import SceneCalibrationTool from "../../features/experiences/SceneCalibrationTool";
import DynamicBreadcrumbs from "../../ui/DynamicBreadcrumbs/DynamicBreadcrumbs";
import cotecmarLogoColored from "../../../assets/images/cotecmar-logo.png";
import "./DynamicNavbar.css";

const DynamicNavbarView = (props) => {
  const {
    children,
    leftActions,
    showBackButton = true,
    title = "Portal RV360",
    subtitle = "Sistema de Visualización 360°",
    middleContent,
    scenes,
    currentScene,
    isDarkStyle,
    isLandingPage,
    isExperienceView,
    showMapModal,
    currentUser,
    menuOpen,
    showPasswordSettings,
    showProfileSettings,
    showSceneCalibration,
    isLightMode,
    customMappings,
    customLinks,
    breadcrumbIgnoreSegments,
    handleBack,
    handleMapClose,
    handleMapSceneSelect,
    handleNavigateHome,
    handleMenuMouseEnter,
    handleMenuMouseLeave,
    handleMenuToggle,
    handleGalleryClick,
    handleProfileEditClick,
    handlePasswordClick,
    handleCalibrationClick,
    handleThemeToggle,
    handleLogout,
    handlePasswordSettingsClose,
    handleProfileUpdated,
    handleProfileSettingsClose,
    handleSceneCalibrationClose,
    getProjectDropdownItems,
  } = props;

  if (isLandingPage) {
    return null;
  }

  return (
    <>
      <header
        className={`manager-header ${!isDarkStyle ? 'light-navbar' : ''} dynamicnavbar__header`}
        role="banner"
      >
        <div className="manager-header-inner dynamicnavbar__header-inner">
          <div className="manager-brand dynamicnavbar__brand">
            {leftActions}
            {showBackButton && (
              <button
                className="back-btn dynamicnavbar__back-btn"
                onClick={handleBack}
                title="Volver"
              >
                <FaArrowLeft /> Atrás
              </button>
            )}

            <img
              src={cotecmarLogoColored}
              alt="COTECMAR"
              className="manager-logo dynamicnavbar__logo"
              onClick={handleNavigateHome}
            />
          </div>

          <div className="manager-header-middle dynamicnavbar__middle">
            {middleContent || (
              <DynamicBreadcrumbs 
                ignoreSegments={breadcrumbIgnoreSegments || ['admin', 'gallery']}
                customMappings={customMappings || {
                  project: "Proyectos",
                  experience: "Zonas",
                  details: "Detalles",
                  edit: "Editar",
                  scene: "Zona",
                  admin: "Gestión de Proyecto",
                  users: "Usuarios",
                  permissions: "Permisos",
                  gallery: "Galería",
                  landing: "Tarjetas"
                }} 
                customLinks={customLinks || {
                  project: "/admin"
                }}
                customDropdowns={
                  isExperienceView
                    ? { project: getProjectDropdownItems() }
                    : {}
                }
              />
            )}
          </div>

          <div className="manager-header-actions dynamicnavbar__actions">
            {children}
            
            <div 
              className="profile-container dynamicnavbar__profile-container"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button className="profile-btn dynamicnavbar__profile-btn" onClick={handleMenuToggle}>
                <div className="avatar-wrapper dynamicnavbar__avatar-wrapper">
                  <FaUserCircle className="user-avatar-icon dynamicnavbar__avatar-icon" />
                </div>
                <span className="avatar-username dynamicnavbar__avatar-username">{currentUser?.name || 'Perfil'}</span>
                <FaChevronDown className="dynamicnavbar__chevron" />
              </button>
              {menuOpen && (
                <div className="profile-dropdown-menu dynamicnavbar__dropdown-menu">
                  <div className="dropdown-user-info dynamicnavbar__dropdown-user-info">
                    <p className="user-name dynamicnavbar__dropdown-username">{currentUser?.name || 'Usuario'}</p>
                    <p className="user-role dynamicnavbar__dropdown-userrole">{currentUser?.email || ''}</p>
                  </div>
                  <hr className="dropdown-divider dynamicnavbar__dropdown-divider" />
                  <button className="dropdown-item dynamicnavbar__dropdown-item" onClick={handleGalleryClick}>
                    <FaImages className="dropdown-icon dynamicnavbar__dropdown-icon" /> Galería de proyectos
                  </button>
                  <button className="dropdown-item dynamicnavbar__dropdown-item" onClick={handleProfileEditClick}>
                    <FaUserEdit className="dropdown-icon dynamicnavbar__dropdown-icon" /> Editar información
                  </button>
                  <button className="dropdown-item dynamicnavbar__dropdown-item" onClick={handlePasswordClick}>
                    <FaKey className="dropdown-icon dynamicnavbar__dropdown-icon" /> Cambiar contraseña
                  </button>
                  <button className="dropdown-item dynamicnavbar__dropdown-item" onClick={handleCalibrationClick}>
                    <FaMapMarkerAlt className="dropdown-icon dynamicnavbar__dropdown-icon" /> Calibrar orientación
                  </button>
                  <button className="dropdown-item dynamicnavbar__dropdown-item" onClick={handleThemeToggle}>
                    {isLightMode ? <FaMoon className="dropdown-icon dynamicnavbar__dropdown-icon" /> : <FaSun className="dropdown-icon dynamicnavbar__dropdown-icon" />} {isLightMode ? 'Activar modo oscuro' : 'Activar modo claro'}
                  </button>
                  <hr className="dropdown-divider dynamicnavbar__dropdown-divider" />
                  <button className="dropdown-item logout dynamicnavbar__dropdown-item dynamicnavbar__dropdown-item--logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon dynamicnavbar__dropdown-icon" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="dynamicnavbar__spacer" aria-hidden="true" />

      <MapModal
        isOpen={showMapModal}
        onClose={handleMapClose}
        scenes={scenes}
        currentScene={currentScene}
        onSceneSelect={handleMapSceneSelect}
      />

      {showPasswordSettings && (
        <PasswordSettings onClose={handlePasswordSettingsClose} />
      )}
      {showProfileSettings && (
        <ProfileSettings onClose={handleProfileSettingsClose} onProfileUpdated={handleProfileUpdated} />
      )}
      {showSceneCalibration && (
        <SceneCalibrationTool onClose={handleSceneCalibrationClose} />
      )}
    </>
  );
};

export default DynamicNavbarView;
