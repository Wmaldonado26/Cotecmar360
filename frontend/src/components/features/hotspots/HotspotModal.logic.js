import { useEffect, useMemo, useState } from "react";
import {
  FaChevronRight,
  FaFolder,
  FaFilePdf,
  FaImage,
  FaVideo,
  FaPaperclip,
} from "react-icons/fa";
import { buildAttachmentTree, detectFileType } from "../../../components/features/hotspots/utils/buildAttachmentTree";

export default function useHotspotModalLogic(props) {
  const { isOpen, onClose, content } = props;

  const [visible, setVisible] = useState(false);
  const [openNodes, setOpenNodes] = useState(() => new Set());

  useEffect(() => {
    setVisible(!!isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape" && typeof onClose === "function") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = orig;
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  const handleOverlayClick = handleClose;
  const handleModalClick = (e) => e.stopPropagation();

  const type = content?.hotspotType || content?.type || "info";
  const isInfo = type === "info";

  const title = content?.title || (isInfo ? "Información" : "Elemento");
  const description = content?.description || "";

  const attachments = useMemo(() => {
    if (!isOpen) return [];
    const a = Array.isArray(content?.attachments) ? content.attachments : [];
    return a.map((x) => ({
      ...x,
      __name: x.originalName || x.filename || x.name || "archivo",
    }));
  }, [content, isOpen]);

  const infoImages = useMemo(() => {
    if (!isInfo) return [];
    return attachments.filter((a) => detectFileType(a) === "image");
  }, [isInfo, attachments]);

  const coverImageUrl = useMemo(() => {
    if (!isInfo) return null;
    const explicit =
      content?.coverImage ||
      content?.image ||
      content?.previewImage ||
      content?.thumbnail;
    if (explicit && typeof explicit === "string" && explicit.trim())
      return explicit.trim();
    if (infoImages.length > 0 && infoImages[0].url) return infoImages[0].url;
    return null;
  }, [isInfo, content, infoImages]);

  const tree = useMemo(() => {
    if (attachments.length === 0) return null;
    return buildAttachmentTree(attachments);
  }, [attachments]);

  const toggleNode = (nodeKey) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeKey)) next.delete(nodeKey);
      else next.add(nodeKey);
      return next;
    });
  };

  const isNodeOpen = (nodeName, level) => {
    if (level <= 1) return true;
    return openNodes.has(nodeName);
  };

  const getFileIcon = (att) => {
    const { isPdf, isImage, isVideo } = detectFileType(att);
    if (isPdf) return FaFilePdf;
    if (isVideo) return FaVideo;
    if (isImage) return FaImage;
    return FaPaperclip;
  };

  const ChevronIcon = FaChevronRight;
  const FolderIcon = FaFolder;

  return {
    visible,
    handleClose,
    handleOverlayClick,
    handleModalClick,
    type,
    isInfo,
    title,
    description,
    attachments,
    coverImageUrl,
    tree,
    toggleNode,
    isNodeOpen,
    getFileIcon,
    ChevronIcon,
    FolderIcon,
  };
}
