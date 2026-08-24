import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './ProfileSettings.css';

const ProfileSettingsView = ({
  onClose,
  profileForm,
  setProfileForm,
  profileSaving,
  profileError,
  profileSuccess,
  handleSaveProfile,
}) => {
  return (
    <div className="profile-modal-overlay" onClick={() => onClose()}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <span className="profile-chip active">Información</span>
          </div>
          <h2>Información Personal</h2>
          <p>Actualiza los datos asociados a tu cuenta.</p>
        </div>
        <form onSubmit={handleSaveProfile} className="profile-form">
          <div className="profile-section">
            <h3>Información básica</h3>
            <div className="profile-grid">
              <label className="profile-field profile-field--full">
                <span>Nombre</span>
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </label>
              <label className="profile-field profile-field--wide">
                <span>Correo</span>
                <div className="profile-input-wrap">
                  <FaEnvelope />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </label>
              <label className="profile-field">
                <span>Teléfono</span>
                <div className="profile-input-wrap">
                  <FaPhone />
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </label>
            </div>
          </div>
          {profileError && <div className="profile-error">{profileError}</div>}
          {profileSuccess && <div className="profile-success">{profileSuccess}</div>}
          <div className="profile-actions">
            <button type="button" className="profile-btn secondary" onClick={() => onClose()}>
              Cancelar
            </button>
            <button type="submit" className="profile-btn primary" disabled={profileSaving}>
              {profileSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsView;
