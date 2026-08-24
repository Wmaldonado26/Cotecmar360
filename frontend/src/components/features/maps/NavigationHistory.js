import React from "react";
import useNavigationHistoryLogic from "./NavigationHistory.logic";
import NavigationHistoryView from "./NavigationHistory.jsx";

const NavigationHistory = (props) => {
  const logic = useNavigationHistoryLogic(props);
  return <NavigationHistoryView {...props} {...logic} />;
};

export default NavigationHistory;
