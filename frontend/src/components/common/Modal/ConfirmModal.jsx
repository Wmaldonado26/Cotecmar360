import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ConfirmModal.css';

const ConfirmModalView = (props) => {
  const { 
    isOpen, 
    title, 
    message, 
    type = 'confirm',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    requiresConfirmation = false,
    confirmationText = '',
    showCancelButton = true,
    confirmInput,
    handleConfirmInputChange,
    handleConfirm,
    handleClose,
    handleOverlayClick,
    handleModalStopPropagation,
    getIcon,
    isConfirmDisabled,
  } = props;

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className={`confirm-modal ${type}`} onClick={handleModalStopPropagation}>
        <button className="modal-close-btn" onClick={handleClose}>
          <FaTimes />
        </button>
        
        <div className="modal-header">
          {getIcon()}
          <h2>{title}</h2>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
          
          {requiresConfirmation && (
            <div className="confirmation-input-group">
              <label>
                Para confirmar, escribe: <strong>{confirmationText}</strong>
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={handleConfirmInputChange}
                placeholder={`Escribe "${confirmationText}"`}
                className="confirmation-input"
                autoFocus
              />
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          {showCancelButton && (
            <button className="modal-btn cancel" onClick={handleClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={`modal-btn confirm ${type}`} 
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModalView;
