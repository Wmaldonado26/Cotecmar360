import React from 'react';
import useMapModalLogic from './MapModal.logic';
import MapModalView from './MapModal.jsx';

const MapModal = (props) => {
  const logic = useMapModalLogic(props);
  return <MapModalView {...props} {...logic} />;
};

export default MapModal;
