import React from "react";
import useProgressBreadcrumbLogic from "./ProgressBreadcrumb.logic";
import ProgressBreadcrumbView from "./ProgressBreadcrumb.jsx";

const ProgressBreadcrumb = (props) => {
  const logic = useProgressBreadcrumbLogic(props);
  return <ProgressBreadcrumbView {...props} {...logic} />;
};

export default ProgressBreadcrumb;
