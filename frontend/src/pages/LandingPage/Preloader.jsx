import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import cotecmarLogo from "../../assets/images/cotecmar1.svg";
import "./Preloader.css";

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const subTextRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake loading progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 15; // fast progress
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 40); // 40ms tick

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // In animation
    const tl = gsap.timeline();
    
    // 1. Light sweep (barrido de luz)
    tl.to(lineRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut"
    })
    .to(lineRef.current, {
      opacity: 0,
      duration: 0.4
    })
    // 2. Logo emerge (opacity + blur + scale)
    .fromTo(logoRef.current, 
      { opacity: 0, scale: 0.85, filter: "blur(12px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
      "-=0.4"
    )
    // 3. Texts and Progress
    .fromTo(textRef.current, 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(subTextRef.current, 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(progressRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

  }, []);

  // =========================
  // BLOQUEAR SCROLL GLOBAL MIENTRAS PRELOADER ESTÉ MONTADO
  // - Al montar: hidden body/html/root (evita scroll mientras carga progreso)
  // - Cleanup de React + onComplete de GSAP: LIBERAMOS 2 veces (a prueba de timing)
  // =========================
  const unlockScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    const r = document.getElementById("root");
    if (r) r.style.overflow = "";
  };
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    const rootEl = document.getElementById("root");
    const prevRoot = rootEl ? rootEl.style.overflow : "";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (rootEl) rootEl.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      if (rootEl) rootEl.style.overflow = prevRoot;
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Once loading is 100%, hold for a brief moment then trigger out animation
      const tl = gsap.timeline({
        onComplete: () => {
          // LIBERAR SCROLL ANTES de avisar al padre (evita timing GSAP)
          unlockScroll();
          if (typeof onComplete === "function") onComplete();
        },
        delay: 0.3 // brief pause at 100%
      });

      // Transición elegante hacia la Landing
      // 1. Logo aumenta ligeramente
      // 2. Textos y progreso se desvanecen
      // 3. Fondo se desvanece
      tl.to([textRef.current, subTextRef.current, progressRef.current], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      })
      .to(logoRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.2")
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "<");
    }
  }, [progress, onComplete]);

  return (
    <div ref={containerRef} className="premium-preloader">
      <div className="preloader-particles"></div>
      <div ref={lineRef} className="preloader-light-line"></div>
      
      <div className="preloader-content">
        <div className="preloader-logo-wrapper" ref={logoRef}>
          <img src={cotecmarLogo} alt="COTECMAR" className="preloader-logo" />
        </div>
        
        <div className="preloader-text-container">
          <h1 ref={textRef} className="preloader-title">COTECMAR</h1>
          <h2 ref={subTextRef} className="preloader-subtitle">Experiencia Virtual 360°</h2>
        </div>

        <div ref={progressRef} className="preloader-progress-container">
          <div className="preloader-progress-text">LOADING {progress}%</div>
          <div className="preloader-progress-bar">
            <div className="preloader-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
