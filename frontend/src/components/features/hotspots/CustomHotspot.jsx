import React from "react";
import "./CustomHotspot.css";

export default function CustomHotspotView({
  type,
  previewImage,
  label,
  rotation,
  meta,
  isActive,
  previewError,
  handleMouseEnter,
  handleMouseLeave,
  handleTouchStart,
  handleTouchEnd,
  handlePreviewError,
}) {
  const Icon = meta.Icon;
  const shouldShowPreview = previewImage && !previewError;

  if (type === "nav") {
    // If a specific rotation is provided, we use a CSS variable to pass it to the stylesheet
    // so it can be combined with the rotateX correctly.
    const customStyle = rotation !== undefined && rotation !== null 
      ? { '--arrow-rotation': `${rotation}deg` } 
      : {};

    return (
      <div
        className={`nav-hotspot-container ${isActive ? "active" : ""}`}
        style={customStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={meta.aria}
        title={label || meta.aria}
      >
        <div className="arrow-3d">
          <svg viewBox="0 0 100 80" className="arrow-svg">
            <path d="M 10,35 L 50,10 L 90,35 L 80,45 L 50,25 L 20,45 Z" fill="#FFFFFF" opacity="0.95"/>
            <path d="M 10,65 L 50,40 L 90,65 L 80,75 L 50,55 L 20,75 Z" fill="#FFFFFF" opacity="0.95"/>
          </svg>
        </div>

        {shouldShowPreview ? (
          <img
            className="hs-preview"
            src={previewImage}
            alt={label || "Preview"}
            onError={handlePreviewError}
          />
        ) : null}

        {label ? <div className="hs-label">{label}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={`hs-root ${meta.cls} ${isActive ? "active" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={meta.aria}
      title={label || meta.aria}
    >
      <div className="hs-ring" />

      <div className="hs-core">
        <Icon className="hs-ico" />
      </div>

      {shouldShowPreview ? (
        <img
          className="hs-preview"
          src={previewImage}
          alt={label || "Preview"}
          onError={handlePreviewError}
        />
      ) : null}

      {label ? <div className="hs-label">{label}</div> : null}
    </div>
  );
}
