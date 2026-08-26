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
  
  // Nuevo estado para la experiencia de edicin unificada
  const [formLanguage, setFormLanguage] = useState("es");
  const [formData, setFormData] = useState({ 
    layer: "", 
    title: "", 
    titleEn: "", 
    description: "", 
    descriptionEn: "", 
    orderIndex: 0, 
    link: "" 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateMessage, setTranslateMessage] = useState(null);
  const [translateError, setTranslateError] = useState(false);

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
        layer: card.layer || "",
        title: card.title || "",
        titleEn: card.titleEn || "",
        description: card.description || "",
        descriptionEn: card.descriptionEn || "",
        orderIndex: card.orderIndex || 0,
        link: card.link || ""
      });
      // Detectar si falta traduccin
      if (!card.titleEn || !card.descriptionEn) {
        setTranslateMessage("Traduccin pendiente");
        setTranslateError(true);
      } else {
        setTranslateMessage(null);
        setTranslateError(false);
      }
    } else {
      setCurrentCard(null);
      setFormData({ layer: "", title: "", titleEn: "", description: "", descriptionEn: "", orderIndex: 0, link: "" });
      setTranslateMessage(null);
      setTranslateError(false);
    }
    setFormLanguage("es");
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setCurrentCard(null);
    setTranslateMessage(null);
    setTranslateError(false);
  };

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);
  const handleEditModalStopPropagation = (e) => e.stopPropagation();

  const handleFormLayerChange = (e) => setFormData({ ...formData, layer: e.target.value });
  const handleFormOrderChange = (e) => setFormData({ ...formData, orderIndex: e.target.value });
  const handleFormLinkChange = (e) => setFormData({ ...formData, link: e.target.value });

  // Manejadores unificados segn idioma
  const handleFormTitleChange = (e) => {
    if (formLanguage === 'es') {
      setFormData({ ...formData, title: e.target.value });
    } else {
      setFormData({ ...formData, titleEn: e.target.value });
    }
  };

  const handleFormDescriptionChange = (e) => {
    if (formLanguage === 'es') {
      setFormData({ ...formData, description: e.target.value });
    } else {
      setFormData({ ...formData, descriptionEn: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFormLanguageChange = (e) => {
    setFormLanguage(e.target.value);
  };

  const handleRefreshTranslation = async (e) => {
    e.preventDefault();
    const sourceTitle = formLanguage === 'es' ? formData.title : formData.titleEn;
    const sourceDesc = formLanguage === 'es' ? formData.description : formData.descriptionEn;
    
    if (!sourceTitle || !sourceDesc) {
      setTranslateMessage("Completa el ttulo y la descripcin primero.");
      setTranslateError(true);
      return;
    }

    setIsTranslating(true);
    setTranslateMessage("Traduciendo contenido...");
    setTranslateError(false);

    try {
      const result = await landingService.translateContent({
        language: formLanguage,
        title: sourceTitle,
        description: sourceDesc
      });
      
      if (formLanguage === 'es') {
        setFormData(prev => ({
          ...prev,
          titleEn: result.title,
          descriptionEn: result.description
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          title: result.title,
          description: result.description
        }));
      }
      setTranslateMessage("Traduccin generada correctamente");
      setTranslateError(false);
    } catch (err) {
      console.error(err);
      setTranslateMessage("No fue posible generar la traduccin. Puedes intentarlo nuevamente.");
      setTranslateError(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (isTranslating) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("layer", formData.layer);
      data.append("orderIndex", formData.orderIndex);
      data.append("link", formData.link);
      
      const sourceTitle = formLanguage === 'es' ? formData.title : formData.titleEn;
      const sourceDesc = formLanguage === 'es' ? formData.description : formData.descriptionEn;

      // Si est creando y los datos de traduccin estn vacos, decirle al backend que traduzca
      const isNew = !currentCard;
      const needsTranslation = isNew && ((formLanguage === 'es' && !formData.titleEn) || (formLanguage === 'en' && !formData.title));
      
      if (needsTranslation) {
        data.append("translate_now", "true");
        data.append("language", formLanguage);
        data.append("title", sourceTitle);
        data.append("description", sourceDesc);
      } else {
        // Enviar todo lo que tenemos (ya sea manual o por 'Actualizar traduccin')
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("titleEn", formData.titleEn);
        data.append("descriptionEn", formData.descriptionEn);
      }

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      if (currentCard) {
        await landingService.updateCard(currentCard.id, data);
      } else {
        await landingService.createCard(data);
      }
      await fetchCards();
      handleCloseEdit();
    } catch (err) {
      console.error(err);
      setError("Error al guardar la tarjeta.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Seguro que deseas eliminar esta tarjeta?")) return;
    try {
      setLoading(true);
      await landingService.deleteCard(id);
      await fetchCards();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la tarjeta.");
      setLoading(false);
    }
  };

  return {
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
  };
}
