import React from 'react';
import './InformationBubbleHotspot.css';

const InformationBubbleHotspot = ({ text }) => {
  return (
    <div className="information-bubble-container">
      <div className="information-bubble-tooltip">
        {text}
      </div>
      <div className="information-bubble-anchor"></div>
    </div>
  );
};

export default InformationBubbleHotspot;
