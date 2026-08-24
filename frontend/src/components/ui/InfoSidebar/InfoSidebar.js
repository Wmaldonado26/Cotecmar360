import React from "react";
import useInfoSidebarLogic from "./InfoSidebar.logic";
import InfoSidebarView from "./InfoSidebar.jsx";

const InfoSidebar = (props) => {
  const logic = useInfoSidebarLogic(props);
  return <InfoSidebarView {...props} {...logic} />;
};

export default InfoSidebar;
