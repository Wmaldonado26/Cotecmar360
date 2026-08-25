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

export default LandingPage;  mix-blend-mode: screen;