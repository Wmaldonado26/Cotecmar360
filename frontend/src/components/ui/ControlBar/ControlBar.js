import React from "react";
import useControlBarLogic from "./ControlBar.logic";
import ControlBarView from "./ControlBar.jsx";

const ControlBar = (props) => {
  const logic = useControlBarLogic(props);
  return <ControlBarView {...props} {...logic} />;
};

export default ControlBar;
