import React, { useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTrash } from 'react-icons/fa';

export default function useConfirmModalLogic(props) {
  const { 
    isOpen, 
    onClose, 
    onConfirm, 
    type = 'confirm',
    requiresConfirmation = false,
    confirmationText = '',
  } = props;

  const [confirmInput, setConfirmInput] = useState('');

  const handleConfirmInputChange = (e) => setConfirmInput(e.target.value);

  const handleConfirm = () => {
    if (requiresConfirmation && confirmInput !== confirmationText) {
      return;
    }
    onConfirm();
    setConfirmInput('');
  };

  const handleClose = () => {
    setConfirmInput('');
    onClose();
  };

  const handleOverlayClick = handleClose;
  const handleModalStopPropagation = (e) => e.stopPropagation();

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaExclamationTriangle className="modal-icon danger" />;
      case 'alert':
        return <FaCheckCircle className="modal-icon success" />;
      case 'info':
        return <FaInfoCircle className="modal-icon info" />;
      case 'delete':
        return <FaTrash className="modal-icon danger" />;
      default:
        return <FaInfoCircle className="modal-icon info" />;
    }
  };

  const isConfirmDisabled = requiresConfirmation && confirmInput !== confirmationText;

  return {
    confirmInput,
    handleConfirmInputChange,
    handleConfirm,
    handleClose,
    handleOverlayClick,
    handleModalStopPropagation,
    getIcon,
    isConfirmDisabled,
  };
}
