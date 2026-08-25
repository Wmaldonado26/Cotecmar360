import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import authService from "../../services/AuthService";
import landingService from "../../services/LandingService";

gsap.registerPlugin(ScrollTrigger);

const DICTIONARIES = {
  es: {
    brand: "COTECMAR",
    brandAlt: "COTECMAR",
    logoShowcaseAlt: "XR Lab",
    titleHome: "Tour Virtual 360° | COTECMAR",
    themeToggle: "Cambiar tema",
    menuToggle: "Abrir menú",
    menuClose: "Cerrar menú",
    menu: {
      goToPanel: "Ir al panel",
      goToGallery: "Ir a la galeria",
      login: "Iniciar sesión",
    },
    tourCard: {
      action: "Recorrido 360",
      tour360Alt: "Vista 360",
      clickAction: "Hacer click",
    },
    lang: {
      toggle: "Cambiar idioma",
      label: "ES",
      short: "ES",
    },
    aria: {
      header: "Cabecera principal",
    },
  },
  en: {
    brand: "COTECMAR",
    brandAlt: "COTECMAR",
    logoShowcaseAlt: "XR Lab",
    titleHome: "360° Virtual Tour | COTECMAR",
    themeToggle: "Toggle theme",
    menuToggle: "Open menu",
    menuClose: "Close menu",
    menu: {
      goToPanel: "Go to dashboard",
      goToGallery: "Go to gallery",
      login: "Sign in",
    },
    tourCard: {
      action: "360° Tour",
      tour360Alt: "360° View",
      clickAction: "Click here",
    },
    lang: {
      toggle: "Switch language",
      label: "EN",
      short: "EN",
    },
    aria: {
      header: "Main header",
    },
  },
};

const NESTED_KEY_RE = /^[a-z_][a-z0-9_]*(\.[a-z_][a-z0-9_]*)*$/i;

function resolveDict(dict, path) {
  if (typeof path !== "string" || !NESTED_KEY_RE.test(path)) return path;
  const parts = path.split(".");
  let current = dict;
  for (const p of parts) {
    if (current && typeof current === "object" && p in current) {
      current = current[p];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

const useLandingPageLogic = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const scrollSectionRef = useRef(null);
  const logoStageRef = useRef(null);
  const logoFrameRef = useRef(null);
  const logoImageRef = useRef(null);
  const videoBgRef = useRef(null);
  const scrollArrowRef = useRef(null);
  const fullScreenCardRef = useRef(null);
  const fullScreenImageRef = useRef(null);
  const fullScreenTextRef = useRef(null);

  const [stackingCards, setStackingCards] = useState([]);

  const [lang, setLang] = useState("es");

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
      try {
        const data = await landingService.getCards();
        setStackingCards(data);
      } catch (err) {
        console.error("Error fetching landing cards:", err);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    const body = document.body;
    if (!body) return;
    const savedLang = localStorage.getItem('landing-lang');
    const startLang = (savedLang === "es" || savedLang === "en") ? savedLang : (navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
    setLang(startLang);

    body.classList.remove('landing-light');
    body.classList.add('landing-dark');

    document.documentElement.lang = startLang;
    document.title = resolveDict(DICTIONARIES[startLang] || DICTIONARIES.es, "titleHome");

    // GSAP animations removed per user request
    
    setTimeout(() => {
      try {
        landingService.registerVisit().catch(() => {});
      } catch (_) { }
    }, 2000);

    return () => {
      document.documentElement.lang = "es";
      document.title = "COTECMAR";
    };
  }, []);

  const activeDict = useMemo(() => DICTIONARIES[lang] || DICTIONARIES.es, [lang]);

  const t = useCallback((key) => {
    return resolveDict(activeDict, key);
  }, [activeDict]);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "es" ? "en" : "es";
      try { localStorage.setItem("landing-lang", next); } catch (_) {}
      document.documentElement.lang = next;
      document.title = resolveDict(DICTIONARIES[next] || DICTIONARIES.es, "titleHome");
      return next;
    });
  }, []);

  return {
    navigate,
    currentUser,
    isAuthenticated,
    scrollSectionRef,
    logoStageRef,
    logoFrameRef,
    logoImageRef,
    videoBgRef,
    scrollArrowRef,
    fullScreenCardRef,
    fullScreenImageRef,
    fullScreenTextRef,
    stackingCards,
    lang,
    toggleLang,
    t,
  };
};

export default useLandingPageLogic; 