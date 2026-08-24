import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./DynamicBreadcrumbs.css";

const DynamicBreadcrumbsView = (props) => {
  const {
    homeRoute,
    pathnames,
    toggleDropdown,
    handleDropdownItemClick,
    handleImageError,
    buildBreadcrumbData,
    customDropdowns,
    customActions,
  } = props;

  const breadcrumbData = buildBreadcrumbData();

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to={homeRoute} className="breadcrumb-link dynamicbreadcrumbs__home-link">
            <FaHome size={20} />
          </Link>
        </li>
        {pathnames.length > 0 && <li className="breadcrumb-separator"> - </li>}
        {breadcrumbData.map(({
          segment,
          index,
          routeTo,
          isLast,
          hasDropdown,
          isDropdownOpen,
          hasCustomAction,
          formattedLabel,
        }) => {
          return (
            <React.Fragment key={segment}>
              {index > 0 && <li className="breadcrumb-separator">  </li>}
              <li className={`breadcrumb-item ${isLast ? "active" : ""} ${hasDropdown ? "breadcrumb-dropdown-container" : ""} ${hasDropdown ? "dynamicbreadcrumbs__item--dropdown" : ""}`}>
                {isLast ? (
                  <span 
                    className={`breadcrumb-current ${hasCustomAction || hasDropdown ? "dynamicbreadcrumbs__current--clickable" : ""}`}
                    onClick={() => {
                      if (hasDropdown) {
                        toggleDropdown(segment, isDropdownOpen);
                      } else if (customActions[segment]) {
                        customActions[segment]();
                      }
                    }}
                  >
                    {formattedLabel} {(customActions[segment] || hasDropdown) && <span className="dynamicbreadcrumbs__caret">▼</span>}
                  </span>
                ) : (
                  hasDropdown ? (
                    <span className="breadcrumb-link dynamicbreadcrumbs__link" onClick={() => toggleDropdown(segment, isDropdownOpen)}>
                      {formattedLabel} <span className="dynamicbreadcrumbs__caret">▼</span>
                    </span>
                  ) : customActions[segment] ? (
                    <span className="breadcrumb-link dynamicbreadcrumbs__link" onClick={customActions[segment]}>
                      {formattedLabel} <span className="dynamicbreadcrumbs__caret">▼</span>
                    </span>
                  ) : (
                    <Link to={routeTo} className="breadcrumb-link">
                      {formattedLabel}
                    </Link>
                  )
                )}

                {hasDropdown && isDropdownOpen && (
                  <div className="breadcrumb-dropdown-menu">
                    {customDropdowns[segment].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="breadcrumb-dropdown-item" 
                        onClick={() => handleDropdownItemClick(item)}
                      >
                        {item.image && (
                          <div className="dropdown-item-image">
                            <img src={item.image} alt="" onError={handleImageError} />
                          </div>
                        )}
                        <div className="dropdown-item-content">
                          <div className="dropdown-item-title">{item.label}</div>
                          {item.sublabel && <div className="dropdown-item-subtitle">{item.sublabel}</div>}
                        </div>
                      </div>
                    ))}
                    {customDropdowns[segment].length === 0 && (
                      <div className="breadcrumb-dropdown-empty">No hay elementos</div>
                    )}
                  </div>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default DynamicBreadcrumbsView;
