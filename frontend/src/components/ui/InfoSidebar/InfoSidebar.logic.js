export default function useInfoSidebarLogic(props) {
  const { isOpen, onClose, content } = props;

  const shouldRender = isOpen && content;

  const handleOverlayClick = onClose;

  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = content.pdfUrl;
    link.download = content.pdfName || "documento.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    shouldRender,
    handleOverlayClick,
    handleSidebarClick,
    handleDownloadPDF,
  };
}
