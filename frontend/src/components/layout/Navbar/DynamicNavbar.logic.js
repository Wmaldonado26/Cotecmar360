import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import authService from "../../../services/AuthService";
import projectService from "../../../services/ProjectService";

export default function useDynamicNavbarLogic(props) {
  const {
    showBackButton = true,
    onBack,
  } = props;

  const { isLightMode, toggleLightMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [showMapModal, setShowMapModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showSceneCalibration, setShowSceneCalibration] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    projectService.getAllProjects().then(setAllProjects).catch(console.error);
  }, []);

  const isExperienceView = location.pathname.includes("/experience/");
  const isProjectView = location.pathname.startsWith("/project/") && !isExperienceView;
  const isAdminView = location.pathname.startsWith("/admin");
  const isGalleryView = location.pathname.startsWith("/gallery");
  const isLandingPage = location.pathname === "/";
  const activeStep = isExperienceView ? "viewer" : isProjectView ? "project" : "home";
  const isDarkStyle = isAdminView || isGalleryView || !isLightMode;

  const currentProject = useMemo(() => {
    if (!projectId) return null;
    return allProjects.find((p) => p.id === projectId) || null;
  }, [allProjects, projectId]);

  const customMappings = useMemo(() => {
    const base = {
      project: "Proyectos",
      experience: "Zonas",
      details: "Detalles",
      edit: "Editar",
      scene: "Zona",
      admin: "Gestión de Proyecto",
      users: "Usuarios",
      permissions: "Permisos",
      gallery: "Galería",
      landing: "Tarjetas",
    };
    if (projectId && currentProject?.name) {
      base[projectId] = currentProject.name;
    }
    return base;
  }, [projectId, currentProject]);

  const customLinks = useMemo(() => {
    const base = {
      project: "/admin",
    };
    if (projectId) {
      base[projectId] = isAdminView
        ? `/admin/edit/${projectId}`
        : `/project/${projectId}/details`;
    }
    if (isAdminView) {
      base.edit = isAdminView ? "/admin" : "/admin";
    }
    return base;
  }, [projectId, isAdminView]);

  const breadcrumbIgnoreSegments = useMemo(() => {
    const base = ['admin', 'gallery'];
    if (!isExperienceView) {
      base.push('project', 'details');
    }
    return base;
  }, [isExperienceView]);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const role = currentUser?.role;
    if (role === "admin" || role === "project_admin") {
      navigate("/admin");
    } else {
      navigate("/gallery");
    }
  };

  const handleMapClose = () => setShowMapModal(false);
  const handleMapSceneSelect = (sceneKey) => {
    if (props.onSceneSelect) props.onSceneSelect(sceneKey);
    setShowMapModal(false);
  };

  const handleNavigateHome = () => navigate('/');

  const handleMenuMouseEnter = () => setMenuOpen(true);
  const handleMenuMouseLeave = () => setMenuOpen(false);
  const handleMenuToggle = () => setMenuOpen((v) => !v);

  const handleGalleryClick = () => { setMenuOpen(false); navigate('/gallery'); };
  const handleProfileEditClick = () => { setMenuOpen(false); setShowProfileSettings(true); };
  const handlePasswordClick = () => { setMenuOpen(false); setShowPasswordSettings(true); };
  const handleCalibrationClick = () => { setMenuOpen(false); setShowSceneCalibration(true); };
  const handleThemeToggle = () => { setMenuOpen(false); toggleLightMode(); };
  const handleLogout = () => { authService.logout(); navigate('/login'); };

  const handlePasswordSettingsClose = () => setShowPasswordSettings(false);
  const handleProfileUpdated = (user) => setCurrentUser(user);
  const handleProfileSettingsClose = () => setShowProfileSettings(false);
  const handleSceneCalibrationClose = () => setShowSceneCalibration(false);

  const getProjectDropdownItems = () => allProjects.map(p => ({
    id: p.id,
    label: p.name,
    sublabel: p.vesselType || 'Visualización 360°',
    image: p.thumbnail || p.image || '/images/default_image.png',
    onClick: () => {
      let firstSceneId = null;
      if (p.experiences && p.experiences.length > 0) {
        firstSceneId = p.experiences[0].startScene || p.experiences[0].id;
      } else if (p.scenes && Object.keys(p.scenes).length > 0) {
        firstSceneId = Object.keys(p.scenes)[0];
      }
      if (firstSceneId) {
        navigate(`/project/${p.id}/experience/${firstSceneId}`);
      } else {
        navigate(`/project/${p.id}`);
      }
    }
  }));

  return {
    isLightMode,
    isDarkStyle,
    isLandingPage,
    isExperienceView,
    activeStep,
    showMapModal,
    currentUser,
    menuOpen,
    showPasswordSettings,
    showProfileSettings,
    showSceneCalibration,
    allProjects,
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
  };
}
