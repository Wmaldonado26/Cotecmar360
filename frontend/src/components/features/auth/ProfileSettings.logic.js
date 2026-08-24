import { useState, useEffect } from 'react';
import authService from '../../../services/AuthService';

export default function useProfileSettingsLogic({ onClose, onProfileUpdated }) {
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    const result = await authService.updateMyProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    });

    if (result.success) {
      setProfileSuccess('Información actualizada.');
      if (onProfileUpdated) onProfileUpdated(result.user);
      setTimeout(() => onClose(), 700);
    } else {
      setProfileError(result.error || 'No se pudo actualizar');
    }

    setProfileSaving(false);
  };

  return {
    profileForm,
    setProfileForm,
    profileSaving,
    profileError,
    profileSuccess,
    handleSaveProfile,
  };
}
