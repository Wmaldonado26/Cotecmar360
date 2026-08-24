import React from "react";
import useSceneCalibrationLogic from "./SceneCalibrationTool.logic";
import SceneCalibrationToolView from "./SceneCalibrationTool.jsx";

export default function SceneCalibrationTool(props) {
  const logic = useSceneCalibrationLogic(props);
  return <SceneCalibrationToolView {...props} {...logic} />;
}
