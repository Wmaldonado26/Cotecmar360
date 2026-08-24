import React from 'react';
import usePasswordSettingsLogic from './PasswordSettings.logic';
import PasswordSettingsView from './PasswordSettings.jsx';

const PasswordSettings = (props) => {
  const logic = usePasswordSettingsLogic(props);
  return <PasswordSettingsView {...props} {...logic} />;
};

export default PasswordSettings;
