import React from "react";
import useDynamicNavbarLogic from "./DynamicNavbar.logic";
import DynamicNavbarView from "./DynamicNavbar.jsx";

const DynamicNavbar = (props) => {
  const logic = useDynamicNavbarLogic(props);
  return <DynamicNavbarView {...props} {...logic} />;
};

export default DynamicNavbar;
