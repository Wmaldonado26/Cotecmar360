import React from 'react';
import { FaKey, FaSave, FaTimes, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './PasswordSettings.css';

const PasswordSettingsView = ({
  onClose,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPasswords,
  setShowPasswords,
  message,
  loading,
  handleSubmit,
}) => {
  return (
    <div className="password-settings-overlay">
      <aside className="password-settings-modal">
        <header className="password-settings-header">
          <h3>
            <FaShieldAlt className="password-settings-header__icon" />
            Cambiar Contraseña
          </h3>
          <button className="close-btn" onClick={onClose} title="Cerrar">
            <FaTimes />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="password-settings-content">
            {message.text && (
              <div className={`message-alert ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label>Contraseña Actual</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPasswords(!showPasswords)}
                  title={showPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                >
                  {showPasswords ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <footer className="password-settings-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Contraseña'} <FaSave />
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
};

export default PasswordSettingsView;
