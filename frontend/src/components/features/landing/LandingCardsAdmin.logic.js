import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import landingService from "../../../services/LandingService";
import authService from "../../../services/AuthService";

export default function useLandingCardsAdminLogic(props) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [formData, setFormData] = useState({ layer: "", title: "", description: "", orderIndex: 0, link: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await landingService.getCards();
      setCards(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las tarjetas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.hasRole("admin", "project_admin")) {
      navigate("/");
      return;
    }
    fetchCards();
  }, [navigate]);

  const handleOpenEdit = (card = null) => {
    if (card) {
      setCurrentCard(card);
      setFormData({
        layer: card.layer,
        title: card.title,
        description: card.description,
        orderIndex: card.orderIndex,
        link: card.link || ""
      });
    } else {
      setCurrentCard(null);
      setFormData({ layer: "", title: "", description: "", orderIndex: cards.length, link: "" });
    }
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setCurrentCard(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("layer", formData.layer);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("orderIndex", formData.orderIndex);
      data.append("link", formData.link);
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      if (currentCard) {
        await landingService.updateCard(currentCard.id, data);
      } else {
        await landingService.createCard(data);
      }

      handleCloseEdit();
      fetchCards();
    } catch (err) {
      setError("Error al guardar la tarjeta.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarjeta?")) return;
    try {
      await landingService.deleteCard(id);
      fetchCards();
    } catch (err) {
      setError("Error al eliminar la tarjeta.");
    }
  };

  const handleOverlayClick = () => setShowSidebar(false);
  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarOpen = () => setShowSidebar(true);
  const handleEditOverlayClick = handleCloseEdit;
  const handleEditModalStopPropagation = (e) => e.stopPropagation();

  const handleFormLayerChange = (e) => setFormData({...formData, layer: e.target.value});
  const handleFormTitleChange = (e) => setFormData({...formData, title: e.target.value});
  const handleFormDescriptionChange = (e) => setFormData({...formData, description: e.target.value});
  const handleFormOrderChange = (e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0});
  const handleFormLinkChange = (e) => setFormData({...formData, link: e.target.value});
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSidebarProjectsClick = () => navigate("/admin");
  const handleSidebarUsersClick = () => navigate("/admin/users");
  const handleSidebarPermissionsClick = () => navigate("/admin/permissions");
  const handleBackClick = () => navigate(-1);

  const getCardImageStyle = (card) => ({
    backgroundImage: `url(${card.image || '/images/default_image.png'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  });

  return {
    currentUser,
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
  };
}
