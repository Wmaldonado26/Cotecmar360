import { useMemo, useState } from "react";
import { LuChevronUp, LuPaperclip, LuInfo } from "react-icons/lu";

export default function useCustomHotspotLogic(props) {
  const { type = "nav" } = props;

  const [isActive, setActive] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const meta = useMemo(() => {
    if (type === "element")
      return { cls: "hs--element", Icon: LuPaperclip, aria: "Elemento" };
    if (type === "info") return { cls: "hs--info", Icon: LuInfo, aria: "Info" };
    return { cls: "hs--nav", Icon: LuChevronUp, aria: "Navegación" };
  }, [type]);

  const handleMouseEnter = () => setActive(true);
  const handleMouseLeave = () => setActive(false);
  const handleTouchStart = () => setActive(true);
  const handleTouchEnd = () => setActive(false);
  const handlePreviewError = () => setPreviewError(true);

  return {
    meta,
    isActive,
    previewError,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handlePreviewError,
  };
}
