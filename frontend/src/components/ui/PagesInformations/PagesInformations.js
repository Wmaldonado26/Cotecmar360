import {useRef, useState } from "react";
import usePagesInformationsLogic from "./PagesInformations.logic";
import PagesInformationsView from "./PagesInformations.jsx";

const PagesInformations = (props) => {
  const logic = usePagesInformationsLogic(props);
  return <PagesInformationsView {...props} {...logic} />;
};

export default PagesInformations;
