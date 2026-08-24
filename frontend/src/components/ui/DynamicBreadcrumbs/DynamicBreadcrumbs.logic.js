import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import authService from "../../../services/AuthService";

export default function useDynamicBreadcrumbsLogic(props) {
  const { customMappings = {}, customLinks = {}, customActions = {}, customDropdowns = {}, ignoreSegments = [] } = props;

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x && !ignoreSegments.includes(x));

  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "project_admin";
  const homeRoute = isAdmin ? "/admin" : "/gallery";

  const formatSegment = (segment) => {
    if (customMappings[segment]) {
      return customMappings[segment];
    }
    const decoded = decodeURIComponent(segment).replace(/ /g, " ");
    return decoded.charAt(0).toUpperCase() + decoded.slice(1);
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.breadcrumb-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (segment, isOpen) => {
    setActiveDropdown(isOpen ? null : segment);
  };

  const handleDropdownItemClick = (item) => {
    setActiveDropdown(null);
    if (item.onClick) item.onClick();
  };

  const handleImageError = (e) => {
    e.currentTarget.style.display = 'none';
  };

  const buildBreadcrumbData = () => {
    return pathnames.map((segment, index) => {
      let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      if (customLinks[segment]) {
        routeTo = customLinks[segment];
      }
      const isLast = index === pathnames.length - 1;
      const hasDropdown = Boolean(customDropdowns && customDropdowns[segment]);
      const isDropdownOpen = activeDropdown === segment;
      const hasCustomAction = Boolean(customActions[segment]);
      const formattedLabel = formatSegment(segment);

      return {
        segment,
        index,
        routeTo,
        isLast,
        hasDropdown,
        isDropdownOpen,
        hasCustomAction,
        formattedLabel,
      };
    });
  };

  return {
    homeRoute,
    pathnames,
    activeDropdown,
    formatSegment,
    toggleDropdown,
    handleDropdownItemClick,
    handleImageError,
    buildBreadcrumbData,
    customDropdowns,
    customActions,
  };
}
