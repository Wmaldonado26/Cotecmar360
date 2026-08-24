import { useState } from "react";

export default function useControlBarLogic(props) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const toggleTitle = isMinimized ? "Mostrar controles" : "Ocultar controles";

  return {
    isMinimized,
    toggleMinimize,
    toggleTitle,
  };
}
