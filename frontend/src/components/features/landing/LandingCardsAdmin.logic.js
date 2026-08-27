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
  
  const [formData, setFormData] = useState({ 
    layer: "", 
    titleInput: "", 
    descriptionInput: "", 
    orderIndex: 0, 
    link: "" 
  });
  
  const [sourceChanged, setSourceChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateMessage, setTranslateMessage] = useState(null);
  const [translateError, setTranslateError] = useState(false);

  // Guardamos las traducciones validadas para que al hacer Guardar no repitamos
  const [generatedTranslations, setGeneratedTranslations] = useState(null);

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
      // Mostramos siempre lo que haya en title, que típicamente es el español o el idioma principal
      setFormData({
        layer: card.layer || "",
        titleInput: card.title || "",
        descriptionInput: card.description || "",
        orderIndex: card.orderIndex || 0,
        link: card.link || ""
      });
      if (!card.titleEn || !card.descriptionEn) {
        setTranslateMessage("Falta traducción en esta tarjeta");
        setTranslateError(true);
      } else {
        setTranslateMessage(null);
        setTranslateError(false);
      }
    } else {
      setCurrentCard(null);
      setFormData({ layer: "", titleInput: "", descriptionInput: "", orderIndex: 0, link: "" });
      setTranslateMessage(null);
      setTranslateError(false);
    }
    setSelectedFile(null);
    setIsEditing(true);
    setSourceChanged(false);
    setGeneratedTranslations(null);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setCurrentCard(null);
    setTranslateMessage(null);
    setTranslateError(false);
    setSourceChanged(false);
    setGeneratedTranslations(null);
  };

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);
  const handleEditModalStopPropagation = (e) => e.stopPropagation();

  const handleFormLayerChange = (e) => setFormData({ ...formData, layer: e.target.value });
  const handleFormOrderChange = (e) => setFormData({ ...formData, orderIndex: e.target.value });
  const handleFormLinkChange = (e) => setFormData({ ...formData, link: e.target.value });

  const handleFormTitleChange = (e) => {
    setSourceChanged(true);
    setGeneratedTranslations(null); // Invalidar la traducción previa si modifican
    setFormData({ ...formData, titleInput: e.target.value });
  };

  const handleFormDescriptionChange = (e) => {
    setSourceChanged(true);
    setGeneratedTranslations(null);
    setFormData({ ...formData, descriptionInput: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRefreshTranslation = async (e) => {
    if (e) e.preventDefault();
    if (!formData.titleInput || !formData.descriptionInput) {
      setTranslateMessage("Completa el título y la descripción primero.");
      setTranslateError(true);
      return null;
    }

    setIsTranslating(true);
    setTranslateMessage("Detectando idioma y traduciendo...");
    setTranslateError(false);

    try {
      const result = await landingService.translateContent({
        title: formData.titleInput,
        description: formData.descriptionInput
      });
      
      setGeneratedTranslations(result);
      setTranslateMessage(`Traducción generada correctamente (Idioma detectado: ${result.detectedLanguage === 'es' ? 'Español' : 'Inglés'})`);
      setTranslateError(false);
      setSourceChanged(false);
      return result;
    } catch (err) {
      console.error(err);
      setTranslateMessage("No fue posible generar la traducción. Inténtalo nuevamente.");
      setTranslateError(true);
      return null;
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (isTranslating) return;

    try {
      let finalTranslations = generatedTranslations;

      // Si editaron el texto y no han generado la traducción manualmente, lo hacemos ahora
      if (sourceChanged || !finalTranslations) {
        const isNew = !currentCard;

        if (!isNew && !sourceChanged) {
          // Si no es nuevo y NO modificaron el texto, reutilizamos lo que ya existe
          finalTranslations = {
            titleEs: currentCard.title || "",
            descriptionEs: currentCard.description || "",
            titleEn: currentCard.titleEn || "",
            descriptionEn: currentCard.descriptionEn || ""
          };
        } else if (!isNew && currentCard.titleEn && currentCard.descriptionEn) {
          // Si es edición y SI modificaron el texto, preguntamos qué hacer
          const wantToTranslate = window.confirm("Has modificado el texto original.\n\n¿Deseas actualizar también la traducción automáticamente?\n\n[Aceptar] = Actualizar traducción\n[Cancelar] = Conservar traducción actual");
          if (wantToTranslate) {
            finalTranslations = await handleRefreshTranslation();
            if (!finalTranslations) return;
          } else {
            finalTranslations = {
              detectedLanguage: 'es',
              titleEs: formData.titleInput,
              descriptionEs: formData.descriptionInput,
              titleEn: currentCard.titleEn,
              descriptionEn: currentCard.descriptionEn
            };
          }
        } else {
          // Si es nuevo, o no tenía traducción antes, traducimos directamente
          finalTranslations = await handleRefreshTranslation();
          if (!finalTranslations) return;
        }
      }

      setLoading(true);
      const data = new FormData();
      data.append("layer", formData.layer);
      data.append("orderIndex", formData.orderIndex);
      data.append("link", formData.link);
      
      data.append("titleEs", finalTranslations.titleEs);
      data.append("descriptionEs", finalTranslations.descriptionEs);
      data.append("titleEn", finalTranslations.titleEn);
      data.append("descriptionEn", finalTranslations.descriptionEn);

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
    if (!window.confirm("¿Seguro que deseas eliminar esta tarjeta?")) return;
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
    handleRefreshTranslation,
    handleFormOrderChange,
    handleFormLinkChange,
    handleFileChange,
    handleSaveCard,
    handleDeleteCard,
  };
}
