import React from 'react';
import useConfirmModalLogic from './ConfirmModal.logic';
import ConfirmModalView from './ConfirmModal.jsx';

const ConfirmModal = (props) => {
  const logic = useConfirmModalLogic(props);
  return <ConfirmModalView {...props} {...logic} />;
};

export default ConfirmModal;
