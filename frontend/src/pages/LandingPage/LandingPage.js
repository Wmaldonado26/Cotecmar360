import React, { useState } from "react";
import useLandingPageLogic from './LandingPage.logic';
import LandingPageTemplate from './LandingPage.jsx';
import Preloader from './Preloader';

const LandingPage = () => {
  const logic = useLandingPageLogic();
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <LandingPageTemplate {...logic} />
    </>
  );
};

export default LandingPage;
