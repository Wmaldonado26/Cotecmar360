import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  stats,
  attachments,
  tree,
  handleClose,
  handleOverlayClick,
  handleModalClick,
  onMaximize,
  onMinimize,
  toggleNode,
  isNodeOpen,
  getFileIcon,
  ChevronIcon,
  FolderIcon,
}) {
  const [imageExpanded, setImageExpanded] = useState(false);

  useEffect(() => {
    if (!imageExpanded) return;
    const onKey = (e) => e.key === "Escape" && setImageExpanded(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [imageExpanded]);

  useEffect(() => {
    if (!isOpen) {
      setImageExpanded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const imgSrc =
    coverImageUrl ||
    "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=900&q=80";

  const validStats = Array.isArray(stats)
    ? stats.filter(
        (s) =>
          s &&
          (String(s.label || "").trim() !== "" ||
            String(s.value || "").trim() !== "")
      )
    : [];
  const hasStats = validStats.length > 0;

  // LIGHTBOX por portal — se renderiza directo en document.body con 
  // z-index máximo para cubrir cualquier elemento del visor 360°
  const lightbox = imageExpanded
    ? createPortal(
        <div
          className="hs-lightbox"
          onClick={(e) => {
            e.stopPropagation();
            setImageExpanded(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <img
            src={imgSrc}
            alt={title || "Imagen ampliada"}
            onClick={(e) => e.stopPropagation()}
            className="hs-lightbox__img"
          />

          {/* 🔴 Punto rojo para cerrar (estilo macOS) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageExpanded(false);
            }}
            aria-label="Cerrar imagen ampliada"
            className="hs-lightbox__close-dot"
          >
            <FaTimes
              size={9}
              strokeWidth={3}
              className="hs-lightbox__close-dot-icon"
            />
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div
        className={`hs-modal-overlay ${visible ? "visible" : ""}`}
        aria-hidden={!visible}
        onClick={handleOverlayClick}
      >
        {isInfo ? (
          <div
            className="hs-info-modal relative w-full max-w-[348px] bg-white rounded-[28px] shadow-2xl overflow-hidden border border-slate-100/80 transition-all duration-500 ease-out hover:shadow-blue-900/20"
            onClick={handleModalClick}
            role="dialog"
            aria-modal="true"
          >
            <div className="relative h-[215px] bg-slate-950 overflow-hidden select-none group">
              <img
                src={imgSrc}
                alt={title || "Naval Vessel"}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/50"></div>

              {/* Traffic lights — orden: 🟢 → 🟡 → 🔴 */}
              <div className="absolute top-3.5 right-3.5 z-20">
                <div className="glass-pill px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  {/* 🟢 1. Ampliar imagen */}
                  <button
                    type="button"
                    onClick={() => setImageExpanded(true)}
                    aria-label="Ampliar imagen"
                    className="group/dot relative w-3 h-3 rounded-full
                               bg-gradient-to-b from-emerald-400 to-emerald-500
                               shadow-[inset_0_-1px_1px_rgba(0,0,0,0.25),0_1px_1px_rgba(0,0,0,0.15)]
                               hover:from-emerald-500 hover:to-emerald-600
                               flex items-center justify-center
                               transition-all duration-150 active:scale-90"
                  >
                    <svg
                      width="7"
                      height="7"
                      viewBox="0 0 8 8"
                      className="text-emerald-950 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 1 L1 1 L1 2.5 M5.5 1 L7 1 L7 2.5 M2.5 7 L1 7 L1 5.5 M5.5 7 L7 7 L7 5.5" />
                    </svg>
                  </button>

                  {/* 🟡 2. Sin funcionalidad por el momento */}
                  <button
                    type="button"
                    aria-label="Minimizar (próximamente)"
                    aria-disabled="true"
                    tabIndex={-1}
                    className="group/dot relative w-3 h-3 rounded-full
                               bg-gradient-to-b from-amber-300 to-amber-400
                               shadow-[inset_0_-1px_1px_rgba(0,0,0,0.25),0_1px_1px_rgba(0,0,0,0.15)]
                               flex items-center justify-center
                               cursor-default
                               transition-all duration-150"
                  >
                    <span
                      className="block w-[6px] h-[1.5px] rounded-full bg-amber-950
                                 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150"
                    />
                  </button>

                  {/* 🔴 3. Cerrar */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Cerrar"
                    className="group/dot relative w-3 h-3 rounded-full
                               bg-gradient-to-b from-red-400 to-red-500
                               shadow-[inset_0_-1px_1px_rgba(0,0,0,0.25),0_1px_1px_rgba(0,0,0,0.15)]
                               hover:from-red-500 hover:to-red-600
                               flex items-center justify-center
                               transition-all duration-150 active:scale-90"
                  >
                    <FaTimes
                      size={7}
                      strokeWidth={3}
                      className="text-red-950 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150"
                    />
                  </button>
                </div>
              </div>


            </div>

            <div className="hs-info-modal__body bg-white px-3.5 pt-0.5 pb-3 space-y-2 relative z-20 h-[215px] overflow-y-auto">
              <div className="pt-1 pb-2 mb-1 text-center border-b border-slate-100">
                <h2 className="hs-info-modal__title text-xs font-extrabold tracking-[0.16em] uppercase text-slate-900 select-none">
                  {title || "SYNCROLIFT SYSTEM"}
                </h2>
              </div>

              {hasStats && (
                <div className="grid grid-cols-2 gap-1.5">
                  {validStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="hs-info-modal__stat bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/60 hover:border-blue-300/80 rounded-lg px-2.5 py-1 transition-all duration-150 group"
                    >
                      <span className="hs-info-modal__stat-label block text-[8px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors leading-tight">
                        {stat.label}
                      </span>
                      <div className="flex items-baseline space-x-0.5 mt-0.5 leading-none">
                        <span className="hs-info-modal__stat-value text-sm font-extrabold text-slate-900">
                          {stat.value}
                        </span>
                        {stat.unit && (
                          <span className="hs-info-modal__stat-unit text-[10px] font-bold text-blue-600">
                            {stat.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {description && (
                <div className="pt-1">
                  <p className="hs-info-modal__desc text-[11.5px] leading-relaxed text-slate-600 whitespace-pre-wrap
                                border-l-[3px] border-blue-400/70 pl-2.5 py-0.5">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <aside
            className="hs-modal hs-modal--element"
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

            <header className="hs-modal-header">
              <div className="hs-modal-title-row">
                <span className="hs-pill element">
                  <FaPaperclip />
                  Elemento
                </span>
                <h2 className="hs-modal-title">{title}</h2>
              </div>
            </header>

            <section className="hs-modal-section">
              {description && (
                <p className="hs-modal-description hs-modal-description--no-info">
                  {description}
                </p>
              )}

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
            </section>
          </aside>
        )}
      </div>

      {lightbox}
    </>
  );
}
