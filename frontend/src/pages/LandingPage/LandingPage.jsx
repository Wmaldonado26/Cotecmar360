import { useState } from "react";
import cotecmarLogo from "../../assets/images/logo.png";
import xrlabLogo from "../../assets/images/cotecmar1.svg";
import fondoVideo from "../../assets/images/planta.mp4";
import img360Card from "../../assets/images/CARD.webp";
import "./LandingPage.css";

export const LandingPageTemplate = ({
  navigate,
  isAuthenticated,
  currentUser,
  stackingCards,
  loadingCards,
  errorCards,
  lang,
  toggleLang,
  t,
  retrying,
  retryFetchCards,
}) => {
  const featuredTourUrl = "/project/proj_1787580651232_2f1jl70eu/experience/zone_1787584150095";
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="landing-page">
      <header className="landing-header w-full px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300" role="banner" aria-label={t("aria.header")}>
        <div className="flex items-center gap-4">
          <img 
            src={cotecmarLogo} 
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
            className="landing-lang-btn transition-all flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-md"
            title={t("lang.toggle")}
            aria-label={t("lang.toggle")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
               <circle cx="12" cy="12" r="10"></circle>
               <path d="M2 12h20"></path>
               <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <div className="flex gap-1 items-center font-bold text-xs">
              <span className={`px-1.5 py-0.5 rounded-sm transition-colors ${lang === 'es' ? 'bg-[#2B5398] text-white' : 'text-white/60'}`}>ES</span>
              <span className={`px-1.5 py-0.5 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#2B5398] text-white' : 'text-white/60'}`}>EN</span>
            </div>
          </button>
        </div>
      </header>

      <main className="w-full">
        <section className="landing-logo-scroll w-full">
          <div 
            className={`landing-logo-stage w-full bg-cover bg-center ${videoFailed ? 'video-failed' : ''}`}
          >
            <div className="landing-scanline"></div>

            <video 
              src={fondoVideo} 
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
              autoPlay 
              loop 
              muted 
              playsInline
              preload="metadata"
              poster={img360Card}
              onError={() => setVideoFailed(true)}
              aria-hidden="true"
              style={{ display: videoFailed ? 'none' : 'block' }}
            />
            <div className="absolute inset-0 z-0 bg-black bg-opacity-30 pointer-events-none"></div>
            
            <div className="landing-logo-layer z-10 flex flex-col items-center justify-center">
              <div className="landing-logo-frame w-full">
                <img
                  src={xrlabLogo}
                  alt={t("logoShowcaseAlt")}
                  className="landing-logo-showcase w-full h-auto object-contain"
                />
              </div>
              <p className="landing-hero-slogan text-gray-300 text-sm md:text-base mt-6 tracking-wide text-center max-w-md px-4 font-light drop-shadow-md">
                {t("heroSlogan")}
              </p>
            </div>
            
            <div className="absolute bottom-16 md:bottom-24 left-1/2 transform -translate-x-1/2 text-center z-20 w-full px-4 flex flex-col items-center gap-3">
              <div className="landing-scroll-arrow">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="landing-arrow-3d">
                  <polyline points="7 13 12 18 17 13"></polyline>
                  <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
              </div>
              <span className="text-white/80 text-xs font-medium tracking-[0.15em] uppercase drop-shadow-md">
                {t("scrollHint")}
              </span>
            </div>
          </div>
        </section>

        <section className="landing-stack-section w-full relative">
          
          <div className="w-full">
            <div className="landing-stack-cards" style={{ "--numcards": (stackingCards?.length + 1) || 1 }}>
              
              {loadingCards ? (
                <div className="w-full flex justify-center py-24">
                  <div className="animate-spin rounded-full h-14 w-14 border-4 border-transparent border-t-[#2B5398] border-b-[#8fa7d6]"></div>
                </div>
              ) : errorCards ? (
                <div className="w-full flex flex-col items-center justify-center py-24 text-red-400 font-semibold text-lg text-center px-4 gap-6">
                  <span>{errorCards}</span>
                  <button 
                    onClick={retryFetchCards} 
                    disabled={retrying}
                    className="landing-btn"
                  >
                    {retrying ? "..." : t("retryButton")}
                  </button>
                </div>
              ) : (
                stackingCards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className="landing-stack-card group"
                    style={{ "--index0": index, "--index": index + 1 }}
                  >
                    <div className="landing-stack-card-content">
                      <div className="landing-stack-card-copy">
                        <h3>{lang === 'en' && card.titleEn ? card.titleEn : card.title}</h3>
                        <p className="mb-6">{lang === 'en' && card.descriptionEn ? card.descriptionEn : card.description}</p>
                        
                        {card.link && (
                          <button 
                            className="landing-btn mt-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              const destUrl = card.link;
                              if (destUrl.startsWith("http")) {
                                window.location.href = destUrl;
                              } else {
                                navigate(destUrl);
                              }
                            }}
                          >
                            {t("tourCard.action")}
                          </button>
                        )}
                      </div>
                      <div className="landing-stack-card-media">
                          <img
                            src={card.image || '/images/default_image.png'}
                            alt={card.title || t("tourCard.tour360Alt")}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div 
                className="relative w-full h-screen flex items-center justify-center group overflow-hidden sticky top-0 z-40"
                style={{ marginTop: '0', "--index0": stackingCards?.length || 0, "--index": (stackingCards?.length || 0) + 1, minHeight: '100svh' }}
                onClick={(e) => {
                  if (featuredTourUrl) {
                    if (featuredTourUrl.startsWith("http")) {
                      window.location.href = featuredTourUrl;
                    } else {
                      navigate(featuredTourUrl);
                    }
                  }
                }}
              >
                <img
                  src={img360Card}
                  alt={t("tourCard.tour360Alt")}
                  className={`absolute inset-0 w-full h-full object-cover z-0 origin-center ${featuredTourUrl ? 'cursor-pointer' : ''}`}
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/40 z-10 transition-colors duration-500 group-hover:bg-black/10 group-active:bg-black/10 pointer-events-none"></div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  <h2 className="text-white text-7xl md:text-9xl font-bold tracking-widest opacity-90 drop-shadow-2xl m-0" style={{ color: 'white' }}>
                    Vista 360°
                  </h2>
                  <span className="text-white/90 tracking-[0.2em] uppercase text-sm mt-2 font-medium drop-shadow-md">
                  </span>
                </div>

                {featuredTourUrl && (
                  <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center pointer-events-none">
                    <button 
                      className="landing-btn pointer-events-auto"
                      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (featuredTourUrl.startsWith("http")) {
                          window.location.href = featuredTourUrl;
                        } else {
                          navigate(featuredTourUrl);
                        }
                      }}
                    >
                      {t("tourCard.clickAction")}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPageTemplate;
  