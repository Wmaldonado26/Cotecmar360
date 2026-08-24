import cotecmarLogo from "../../assets/images/logo.png";
import cotecmarLogoColored from "../../assets/images/cotecmar-logo.png";
import xrlabLogo from "../../assets/images/cotecmar1.svg";
import fondoVideo from "../../assets/images/planta.mp4";
import img360Card from "../../assets/images/CARD.png";
import "./LandingPage.css";

export const LandingPageTemplate = ({
  navigate,
  isAuthenticated,
  currentUser,
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
  setIsLightMode,
  primaryAction,
  lang,
  toggleLang,
  t,
}) => {
  const featuredTourUrl = "/gallery";

  return (
    <div className={`landing-page ${isLightMode ? 'light-theme' : ''}`}>
      <header className="landing-header w-full px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300" role="banner" aria-label={t("aria.header")}>
        <div className="flex items-center gap-4">
          <img 
            src={isLightMode ? cotecmarLogoColored : cotecmarLogo} 
            alt={t("brandAlt")}
            className="landing-brand-logo transition-all duration-50" 
          />
          <div className="landing-brand-copy">
            <span>{t("brand")}</span>
          </div>
        </div>

        <div className="flex items-center relative gap-4">
          <button
            onClick={toggleLang}
            className="landing-lang-btn transition-all hover:opacity-80 flex items-center gap-1.5 p-2 rounded-full"
            title={t("lang.toggle")}
            aria-label={t("lang.toggle")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span className="landing-lang-label font-semibold tracking-wider uppercase" style={{ fontSize: 11, minWidth: 22, textAlign: 'center' }}>
              {t("lang.short")}
            </span>
          </button>

          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="transition-colors hover:opacity-70 p-2"
            title={t("themeToggle")}
            aria-label={t("themeToggle")}
          >
            {isLightMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          <button 
            className="hover:opacity-70 transition-colors z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title={isMenuOpen ? t("menuClose") : t("menuToggle")}
            aria-label={isMenuOpen ? t("menuClose") : t("menuToggle")}
          >
            {isMenuOpen ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          <div 
            className={`absolute bg-transparent flex gap-4 transition-all duration-300 top-full right-0 mt-2 flex-col lg:top-1/2 lg:right-full lg:mt-0 lg:mr-4 lg:flex-row ${isMenuOpen ? 'opacity-100 visible translate-y-0 translate-x-0 lg:-translate-y-1/2' : 'opacity-0 invisible -translate-y-2 translate-x-0 lg:translate-x-4 lg:-translate-y-1/2'}`}
          >
            <button 
              className="landing-btn w-48 justify-center" 
              onClick={() => {
                setIsMenuOpen(false);
                primaryAction();
              }}
            >
              {isAuthenticated
                ? (currentUser?.role === "admin" || currentUser?.role === "project_admin")
                  ? t("menu.goToPanel")
                  : t("menu.goToGallery")
                : t("menu.login")}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full">
        <section 
          className="landing-logo-scroll w-full" 
          ref={scrollSectionRef}
        >
          <div 
            className="landing-logo-stage w-full bg-cover bg-center" 
            ref={logoStageRef}
            style={{ backgroundImage: "url('')" }}
          >
            <div className="landing-scanline"></div>

            <video 
              ref={videoBgRef}
              src={fondoVideo} 
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
              autoPlay 
              loop 
              muted 
              playsInline 
            />
            <div className={`absolute inset-0 z-0 transition-colors duration-500 ${isLightMode ? 'bg-white bg-opacity-10' : 'bg-black bg-opacity-10'}`}></div>
            
            <div className="landing-logo-layer z-10">
              <div className="landing-logo-frame" ref={logoFrameRef}>
                <div className="animate-float w-full">
                  <img
                    ref={logoImageRef}
                    src={isLightMode ? cotecmarLogoColored : xrlabLogo}
                    alt={t("logoShowcaseAlt")}
                    className="landing-logo-showcase w-full h-auto object-contain transition-all duration-500"
                  />
                </div>
              </div>
            </div>
            
            <div 
              ref={scrollArrowRef}
              className="absolute bottom-36 left-1/2 transform -translate-x-1/2 text-center z-20 w-full px-4 flex flex-col items-center gap-4"
            >
              <span className="landing-eyebrow"></span>
              <div className="landing-scroll-arrow">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="landing-arrow-3d">
                  <polyline points="7 13 12 18 17 13"></polyline>
                  <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-stack-section w-full relative">
          
          <div className="w-full">
            <div className="landing-stack-cards" style={{ "--numcards": (stackingCards.length + 1) || 1 }}>
              {stackingCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className="landing-stack-card group cursor-pointer"
                  style={{ "--index0": index, "--index": index + 1 }}
                >
                  <div className="landing-stack-card-content">
                    <div className="landing-stack-card-copy">
                      <h3>{card.title}</h3>
                      <p className="mb-6">{card.description}</p>
                      <button 
                        className="landing-btn mt-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(card.link || "https://tudominio.com", "_blank");
                        }}
                      >
                        {t("tourCard.action")}
                      </button>
                    </div>
                    <div className="landing-stack-card-media">
                        <img
                          src={card.image || '/images/default_image.png'}
                          alt={card.title || t("tourCard.tour360Alt")}
                          className="w-full h-full object-cover"
                        />
                    </div>
                  </div>
                </div>
              ))}

            {/* 4th Custom Card: 360 View Fullscreen */}
            <div 
              ref={fullScreenCardRef}
              className="relative w-full h-screen flex items-center justify-center cursor-pointer group overflow-hidden sticky top-0 z-40"
              style={{ marginTop: '0', "--index0": stackingCards.length, "--index": stackingCards.length + 1 }}
              onClick={() => navigate(featuredTourUrl)}
            >
                <img
                  ref={fullScreenImageRef}
                  src={img360Card}
                  alt={t("tourCard.tour360Alt")}
                  className="absolute inset-0 w-full h-full object-cover z-0 origin-center"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 z-10 transition-opacity duration-300 group-hover:bg-opacity-0"></div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  <h2 ref={fullScreenTextRef} className="text-white text-9xl md:text-[15rem] font-bold tracking-widest opacity-90 drop-shadow-2xl m-0 text-stroke-360" style={{ color: 'white' }}>
                    360
                  </h2>
                </div>

                <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center pointer-events-none">
                  <button 
                    className="landing-btn pointer-events-auto"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(featuredTourUrl);
                    }}
                  >
                    {t("tourCard.clickAction")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPageTemplate;
