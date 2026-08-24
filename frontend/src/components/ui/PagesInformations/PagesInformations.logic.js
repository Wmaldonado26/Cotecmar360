import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import projectService from "../../../services/ProjectService";

const DEFAULT_SHIP = {
  name: "Cargando...",
  description: "Cargando información del proyecto...",
  tags: [],
  highlights: [],
  specs: {},
  gallery: [{ id: "loading", src: "/images/default_image.png", title: "Cargando" }],
  attachments: []
};

export default function usePagesInformationsLogic() {
  const navigate = useNavigate();

  const [ship, setShip] = useState(DEFAULT_SHIP);
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState([]);
  const [attachmentCategory, setAttachmentCategory] = useState("Todos");
  const specTrackRef = useRef(null);

  const getShipFromProject = (active) => {
    let highlights = [];
    if (active.highlights && active.highlights.length > 0) {
      highlights = active.highlights;
    } else {
      const firstCat = Object.keys(active.specs || {})[0];
      if (firstCat && active.specs[firstCat]?.length > 0) {
        highlights = active.specs[firstCat].slice(0, 4).map(s => ({
          label: s.k,
          value: s.v
        }));
      } else {
        highlights = [
          { label: "Tipo", value: active.vesselType || "Embarcación" },
          { label: "Estado", value: active.status === "active" ? "Activo" : "Borrador" }
        ];
      }
    }

    let gallery = [];
    if (active.gallery && active.gallery.length > 0) {
      gallery = active.gallery;
    } else {
      gallery = [
        { id: "thumb", src: active.thumbnail || "/images/default_image.png", title: "Principal" }
      ];
    }

    return {
      name: active.name || "Sin nombre",
      description: active.description || "Sin descripción",
      tags: active.tags || [],
      highlights: highlights,
      specs: active.specs || {},
      gallery: gallery,
      attachments: active.attachments || []
    };
  };

  useEffect(() => {
    (async () => {
      try {
        const active = await projectService.getActiveProject();
        if (active) {
          setShip(getShipFromProject(active));
          setIdx(0);
        }
      } catch (error) {
        console.error("Error loading active project in PagesInformations:", error);
        setIdx(0);
      }
    })();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".pi-spec-card"));
    if (!elements.length || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          if (entry.isIntersecting) {
            const elementIndex = elements.indexOf(element);
            element.style.animationDelay = `${(elementIndex % 6) * 80}ms`;
            element.classList.add("pi-inview");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ship.specs]);

  const toggleSpec = useCallback((group) => {
    setExpandedSpecs((prev) =>
      prev.includes(group) ? prev.filter((item) => item !== group) : prev.concat(group)
    );
  }, []);

  const categories = useMemo(() => {
    const base = ["Todos"];
    const unique = Array.from(
      new Set((ship.attachments || []).map((attachment) => attachment.category).filter(Boolean))
    );
    return base.concat(unique);
  }, [ship.attachments]);

  const filteredAttachments = useMemo(() => {
    const list = ship.attachments || [];
    if (attachmentCategory === "Todos") return list;
    return list.filter((attachment) => attachment.category === attachmentCategory);
  }, [ship.attachments, attachmentCategory]);

  const prev = () => {
    setIdx((prevIdx) => (prevIdx - 1 + ship.gallery.length) % ship.gallery.length);
  };

  const next = () => {
    setIdx((prevIdx) => (prevIdx + 1) % ship.gallery.length);
  };

  const scrollSpecs = (direction) => {
    const element = specTrackRef.current;
    if (!element) return;

    const card = element.querySelector(".pi-spec-card");
    const cardWidth = card ? card.getBoundingClientRect().width : 320;
    const step = cardWidth + 12;
    element.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const handleBack = () => navigate(-1);

  const handleThumbClick = (index) => setIdx(index);

  const handleSpecCardKeyDown = (event, group) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSpec(group);
    }
  };

  const handleSpecCardClick = (group) => toggleSpec(group);

  const isSpecExpanded = (group) => expandedSpecs.includes(group);

  return {
    navigate,
    ship,
    idx,
    mounted,
    specTrackRef,
    categories,
    filteredAttachments,
    attachmentCategory,
    setAttachmentCategory,
    prev,
    next,
    scrollSpecs,
    handleBack,
    handleThumbClick,
    handleSpecCardKeyDown,
    handleSpecCardClick,
    isSpecExpanded,
  };
}
