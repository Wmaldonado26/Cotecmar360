import React from "react";
import useLandingPageLogic from './LandingPage.logic.js';
import LandingPageTemplate from './LandingPage.jsx';

const LandingPage = () => {
  const logic = useLandingPageLogic();

  return (
    <>
      <LandingPageTemplate {...logic} />
    </>
  );
};

export default LandingPage;   Display (flex)    height: 250px !important;    height: 220px !important;                  <h2 ref={fullScreenTextRef} className="text-white text-7xl md:text-9xl font-bold tracking-widest opacity-90 drop-shadow-2xl m-0" style={{ color: 'white' }}></h2>