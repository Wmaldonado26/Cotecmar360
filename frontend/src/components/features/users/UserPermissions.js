import React from "react";
import useUserPermissionsLogic from "./UserPermissions.logic";
import UserPermissionsView from "./UserPermissions.jsx";

const UserPermissions = (props) => {
  const logic = useUserPermissionsLogic(props);
  return <UserPermissionsView {...props} {...logic} />;
};

export default UserPermissions;
