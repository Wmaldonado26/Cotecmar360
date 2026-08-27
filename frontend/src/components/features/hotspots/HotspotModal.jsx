import React from "react";
import {
  FaTimes,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaPaperclip,
} from "react-icons/fa";
import "./HotspotModal.css";

function detectFileTypeStandalone(att) {
  const mt = (att.mimetype || "").toLowerCase();
  const url = (att.url || "").toLowerCase();
  const name = (att.__name || att.filename || att.name || "").toLowerCase();
  const isPdf =
    mt === "application/pdf" || /\.pdf($|\?)/.test(url) || /\.pdf$/.test(name);
  const isImage =
    mt.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg|bmp)($|\?)/.test(url) ||
    /\.(png|jpe?g|gif|webp|svg|bmp)$/.test(name);
  const isVideo =
    mt.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov|m4v)($|\?)/.test(url) ||
    /\.(mp4|webm|ogg|mov|m4v)$/.test(name);
  return { isPdf, isImage, isVideo };
}

function TreeNodeView({
  node,
  level,
  nodeKey,
  isNodeOpen,
  toggleNode,
  getFileIcon,
  ChevronIcon,
  FolderIcon,
}) {
  const hasChildren = (node.children?.length || 0) > 0;
  const hasFiles = (node.files?.length || 0) > 0;

  if (!hasChildren && !hasFiles) return null;

  const padLeft = 16 + level * 16;
  const open = isNodeOpen(nodeKey, level);
  const expanded = node.name !== "root" ? open : true;

  return (
    <div className="hs-tree-node">
      {node.name !== "root" && (
        <button
          type="button"
          className="hs-tree-folder"
          onClick={() => toggleNode(nodeKey)}
          aria-expanded={expanded}
          style={{ paddingLeft: padLeft }}
        >
          <span className="hs-tree-folder__chev">
            <ChevronIcon />
          </span>
          <span className="hs-tree-folder__icon">
            <FolderIcon />
          </span>
          <span className="hs-tree-folder__name">{node.name}</span>
        </button>
      )}

      {(node.name === "root" || open) && (
        <div className="hs-tree-children">
          {hasChildren &&
            node.children.map((child) => (
              <TreeNodeView
                key={`${nodeKey}-${child.name}`}
                node={child}
                level={node.name === "root" ? level : level + 1}
                nodeKey={`${nodeKey}-${child.name}`}
                isNodeOpen={isNodeOpen}
                toggleNode={toggleNode}
                getFileIcon={getFileIcon}
                ChevronIcon={ChevronIcon}
                FolderIcon={FolderIcon}
              />
            ))}
          {hasFiles &&
            node.files.map((att, idx) => {
              const FileIcon = getFileIcon(att);
              const { isPdf } = detectFileTypeStandalone(att);
              const padFile = padLeft + 28;

              return (
                <div
                  className="hs-tree-file"
                  key={`${att.url}_${idx}`}
                  style={{ paddingLeft: padFile }}
                >
                 <div
                    className={`hs-tree-file__icon ${isPdf ? "pdf" : ""}`}
                  >
                    <FileIcon />
                  </div>

                  <div className="hs-tree-file__meta">
                    <div className="hs-tree-file__name" title={att.__name}>
                      {att.__name}
                    </div>
                    <div className="hs-tree-file__sub">
                      {att.mimetype || "Archivo"}
                      {att.size
                        ? ` • ${Math.round(att.size / 1024)} KB`
                        : ""}
                    </div>
                  </div>

                  <a
                    className="hs-tree-file__btn"
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaExternalLinkAlt /> Abrir
                  </a>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default function HotspotModalView({
  isOpen,
  visible,
  isInfo,
  coverImageUrl,
  title,
  description,
  attachments,
  tree,
  handleClose,
  handleOverlayClick,
  handleModalClick,
  toggleNode,
  isNodeOpen,
  getFileIcon,
  ChevronIcon,
  FolderIcon,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`hs-modal-overlay ${visible ? "visible" : ""}`}
      aria-hidden={!visible}
      onClick={handleOverlayClick}
    >
      <aside
        className={`hs-modal ${isInfo ? "hs-modal--info" : "hs-modal--element"}`}
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="hs-modal-close"
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          <FaTimes />
        </button>

        <header
          className={`hs-modal-header ${
            isInfo && coverImageUrl ? "has-cover" : ""
          }`}
        >
          {isInfo && coverImageUrl && (
            <div className="hs-modal-cover">
              <img src={coverImageUrl} alt={title} />
              <div className="hs-modal-title-row hs-modal-title-row--overlay">
                <h2 className="hs-modal-title">{title}</h2>
              </div>
            </div>
          )}

          {(!isInfo || !coverImageUrl) && (
            <div className="hs-modal-title-row">
              <span className={`hs-pill ${isInfo ? "info" : "element"}`}>
                {isInfo ? <FaInfoCircle /> : <FaPaperclip />}
                {isInfo ? "Info" : "Elemento"}
              </span>
              <h2 className="hs-modal-title">{title}</h2>
            </div>
          )}
        </header>

        {(description || !isInfo) && (
          <section className="hs-modal-section">
            {description && (
              <p
                className={`hs-modal-description ${
                  !isInfo ? "hs-modal-description--no-info" : ""
                }`}
              >
                {description}
              </p>
            )}

            {!isInfo && (
              <>
                <h4 className="hs-modal-h4">Anexos Disponibles</h4>

                {attachments.length === 0 ? (
                  <div className="hs-empty">
                    No hay anexos asociados a este elemento.
                  </div>
                ) : (
                  <div className="hs-tree">
                    <TreeNodeView
                      node={tree}
                      level={0}
                      nodeKey="root"
                      isNodeOpen={isNodeOpen}
                      toggleNode={toggleNode}
                      getFileIcon={getFileIcon}
                      ChevronIcon={ChevronIcon}
                      FolderIcon={FolderIcon}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </aside>
    </div>
  );
}
