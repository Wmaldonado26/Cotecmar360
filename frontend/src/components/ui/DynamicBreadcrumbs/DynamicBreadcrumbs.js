import React from "react";
import useDynamicBreadcrumbsLogic from "./DynamicBreadcrumbs.logic";
import DynamicBreadcrumbsView from "./DynamicBreadcrumbs.jsx";

const DynamicBreadcrumbs = (props) => {
  const logic = useDynamicBreadcrumbsLogic(props);
  return <DynamicBreadcrumbsView {...props} {...logic} />;
};

export default DynamicBreadcrumbs;
