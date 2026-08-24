import React from 'react';
import useProfileSettingsLogic from './ProfileSettings.logic';
import ProfileSettingsView from './ProfileSettings.jsx';

const ProfileSettings = (props) => {
  const logic = useProfileSettingsLogic(props);
  return <ProfileSettingsView {...props} {...logic} />;
};

export default ProfileSettings;
