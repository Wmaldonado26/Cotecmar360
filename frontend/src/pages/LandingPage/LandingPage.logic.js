import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../../services/AuthService";
import landingService from "../../services/LandingService";

const useLandingPageLogic = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [stackingCards, setStackingCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [errorCards, setErrorCards] = useState(null);

  useEffect(() => {
    const initAuthState = async () => {
      try {
        const res = await authService.checkAuth();
        if (res && res.status === 200 && res.data && res.data.user) {
          const u = res.data.user;
          const formatted = {
            id: u.id,
            email: u.email,
            username: u.username || u.email?.split('@')[0] || "User",
            name: u.name || u.username || u.email?.split('@')[0] || "User",
            role: u.role || 'viewer',
            fullName: u.fullName || u.name || u.username || "User"
          };
          setCurrentUser(formatted);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };
    initAuthState();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      setLoadingCards(true);
      setErrorCards(null);
      try {
        const data = await landingService.getCards();
        if (data && data.length > 0) {
          setStackingCards(data);
        } else {
          setErrorCards("No hay contenido disponible por el momento.");
        }
      } catch (err) {
        console.error("Error fetching landing cards:", err);
        setErrorCards("Hubo un error al cargar el contenido. Por favor intenta de nuevo más tarde.");
      } finally {
        setLoadingCards(false);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    const body = document.body;
    if (body) {
      body.classList.remove('landing-light');
      body.classList.add('landing-dark');
    }

    setTimeout(() => {
      try {
        landingService.registerVisit().catch(() => {});
      } catch (_) { }
    }, 2000);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language || "es";
    document.title = t("titleHome");
  }, [i18n.language, t]);

  const toggleLang = useCallback(() => {
    const nextLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(nextLang);
  }, [i18n]);

  return {
    navigate,
    currentUser,
    isAuthenticated,
    stackingCards,
    loadingCards,
    errorCards,
    lang: i18n.language,
    toggleLang,
    t,
  };
};

export default useLandingPageLogic; 