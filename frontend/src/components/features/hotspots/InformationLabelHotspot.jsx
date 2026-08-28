import React from "react";
import "./InformationLabelHotspot.css";

const InformationLabelHotspot = ({ text }) => {
  return (
    <div className="information-label-hotspot">
      <div className="information-label-hotspot__dot"></div>
      <div className="information-label-hotspot__text">{text}</div>
    </div>
  );
};

export default InformationLabelHotspot;
