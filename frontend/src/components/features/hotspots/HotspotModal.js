import React from "react";
import useHotspotModalLogic from "./HotspotModal.logic";
import HotspotModalView from "./HotspotModal.jsx";

export default function HotspotModal(props) {
  const logic = useHotspotModalLogic(props);
  return <HotspotModalView {...props} {...logic} />;
}
