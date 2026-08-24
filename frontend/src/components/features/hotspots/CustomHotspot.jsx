import React from "react";
import "./CustomHotspot.css";

export default function CustomHotspotView({
  previewImage,
  label,
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
