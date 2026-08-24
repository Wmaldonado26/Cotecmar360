import React from "react";
import useCustomHotspotLogic from "./CustomHotspot.logic";
import CustomHotspotView from "./CustomHotspot.jsx";

export default function CustomHotspot(props) {
  const logic = useCustomHotspotLogic(props);
  return <CustomHotspotView {...props} {...logic} />;
}
