import React from "react";
import "./ProgressBreadcrumb.css";

const ProgressBreadcrumbView = (props) => {
  const { navClassName, buildStepData } = props;
  const stepDataList = buildStepData();

  return (
    <nav className={navClassName} aria-label="Breadcrumb">
      {stepDataList.map(({ step, index, isActive, isCompleted, showSeparator, separatorIsActive }) => {
        return (
          <React.Fragment key={step.key}>
            <div
              className={`progress-breadcrumb__item${
                isActive ? " is-active" : ""
              }${isCompleted ? " is-completed" : ""}`}
            >
              <span className="progress-breadcrumb__icon">{step.icon}</span>
              <span>{step.label}</span>
            </div>
            {showSeparator && (
              <div
                className={`progress-breadcrumb__separator${
                  separatorIsActive ? " is-active" : ""
                }`}
              >
                <span className="progress-breadcrumb__line" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default ProgressBreadcrumbView;
