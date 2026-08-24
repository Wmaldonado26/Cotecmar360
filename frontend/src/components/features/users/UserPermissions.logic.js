import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/UserService";
import projectService from "../../../services/ProjectService";
import authService from "../../../services/AuthService";

export default function useUserPermissionsLogic({ onBack, onLogout, darkMode, onToggleDarkMode }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const sidebarRef = useRef(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleSidebarClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const hamburgerBtn = document.querySelector(".hamburger-btn");
        if (!hamburgerBtn || !hamburgerBtn.contains(event.target)) {
          setShowSidebar(false);
        }
      }
    };
    if (showSidebar) {
      document.addEventListener("mousedown", handleSidebarClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleSidebarClickOutside);
  }, [showSidebar]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, projectsData] = await Promise.all([
        userService.getAllUsers(),
        projectService.getAllProjects(),
      ]);
      setUsers(usersData);
      setProjects(projectsData);

      if (usersData.length > 0) {
        const defaultUser = usersData.find(u => u.role !== "admin") || usersData[0];
        handleSelectUser(defaultUser);
      }
    } catch (err) {
      setError(err.message || "Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedProjectIds(user ? user.projectIds || [] : []);
    setMessage("");
    setError("");
  };

  const handleProjectToggle = (projectId) => {
    setSelectedProjectIds((prev) => {
      const exists = prev.includes(projectId);
      if (exists) {
        return prev.filter((id) => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
        isActive: selectedUser.isActive,
        projectIds: selectedUser.role === "user" ? selectedProjectIds : [],
      };

      const updatedUser = await userService.updateUser(selectedUser.id, payload);
      setMessage(`Permisos actualizados correctamente para ${selectedUser.name}.`);

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setSelectedUser(updatedUser);
    } catch (err) {
      setError(err.message || "No se pudieron guardar los permisos.");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = useMemo(() => users.filter((user) => {
    const searchString = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString)
    );
  }), [users, searchQuery]);

  const isAdmin = currentUser?.role === 'admin';

  const handleNavigateUsers = () => {
    navigate("/admin/users");
    setShowSidebar(false);
  };

  const handleNavigateAdmin = () => {
    navigate("/admin");
    setShowSidebar(false);
  };

  const handleNavigateGallery = () => {
    navigate("/gallery");
    setShowSidebar(false);
  };

  const handlePermissionsNav = () => {
    setShowSidebar(false);
  };

  const handleBackNav = () => {
    navigate(-1);
  };

  return {
    navigate,
    currentUser,
    sidebarRef,
    showSidebar,
    setShowSidebar,
    users,
    projects,
    selectedUser,
    selectedProjectIds,
    searchQuery,
    setSearchQuery,
    loading,
    saving,
    message,
    error,
    filteredUsers,
    isAdmin,
    handleSelectUser,
    handleProjectToggle,
    handleSave,
    handleNavigateUsers,
    handleNavigateAdmin,
    handleNavigateGallery,
    handlePermissionsNav,
    handleBackNav,
  };
}
