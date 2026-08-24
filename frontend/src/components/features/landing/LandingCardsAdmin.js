import React from "react";
import useLandingCardsAdminLogic from "./LandingCardsAdmin.logic";
import LandingCardsAdminView from "./LandingCardsAdmin.jsx";

const LandingCardsAdmin = (props) => {
  const logic = useLandingCardsAdminLogic(props);
  return <LandingCardsAdminView {...props} {...logic} />;
};

export default LandingCardsAdmin;
