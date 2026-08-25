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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
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

  const primaryAction = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate((currentUser?.role === "admin" || currentUser?.role === "project_admin") ? "/admin" : "/gallery");
  };

  useEffect(() => {
    const body = document.body;
    if (!body) return;
    const savedTheme = localStorage.getItem('landing-theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const startLight = savedTheme ? savedTheme === 'light' : prefersLight;

    const savedLang = localStorage.getItem('landing-lang');
    const startLang = (savedLang === "es" || savedLang === "en") ? savedLang : (navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
    setLang(startLang);

    body.classList.remove('landing-dark', 'landing-light');
    body.classList.add(startLight ? 'landing-light' : 'landing-dark');
    setIsLightMode(startLight);

    document.documentElement.lang = startLang;
    document.title = resolveDict(DICTIONARIES[startLang] || DICTIONARIES.es, "titleHome");

    ScrollTrigger.defaults({
      scrub: true,
      markers: false,
    });

    gsap.set(logoFrameRef.current, {
      scale: 0.9,
      opacity: 2,
      yPercent: 0,
    });

    gsap.set(logoImageRef.current, {
      scale: 1,
      opacity: 0.5,
    });

    gsap.set(videoBgRef.current, {
      scale: 1,
      opacity: 0.8,
      filter: "blur(0px)",
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    timeline
      .to(
        scrollArrowRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.1,
          ease: "power1.out",
        },
        0
      )
      .to(
        videoBgRef.current,
        {
          opacity: 0,
          scale: 1, 
          filter: "blur(2px)", 
          duration: 0.5, 
          ease: "power2.inOut",
        },
        0
      )
      .to(
        logoImageRef.current,
        {
          opacity: 1, 
          duration: 0.2, 
          ease: "power2.out",
        },
        0.5 
      );
      
    if (fullScreenCardRef.current && fullScreenImageRef.current && fullScreenTextRef.current) {
      gsap.fromTo(
        fullScreenImageRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          scrollTrigger: {
            trigger: fullScreenCardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      gsap.fromTo(
        fullScreenTextRef.current,
        { y: 150, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: {
            trigger: fullScreenCardRef.current,
            start: "top 80%",
            end: "center center",
            scrub: true,
          }
        }
      );
    }
    
    setTimeout(() => {
      try {
        landingService.registerVisit().catch(() => {});
      } catch (_) { }
    }, 2000);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      timeline.kill();
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

  const setIsLightModePersisted = useCallback((nextValue) => {
    setIsLightMode(nextValue);
    try { localStorage.setItem("landing-theme", nextValue ? "light" : "dark"); } catch (_) {}
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
    isMenuOpen,
    setIsMenuOpen,
    isLightMode,
    setIsLightMode: setIsLightModePersisted,
    primaryAction,
    lang,
    toggleLang,
    t,
  };
};

export default useLandingPageLogic;