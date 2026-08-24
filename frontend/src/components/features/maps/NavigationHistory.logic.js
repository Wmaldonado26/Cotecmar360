import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

export default function useNavigationHistoryLogic({ currentScene, onNavigate, onBack, showBack = true, experiences = [], activeZoneId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/gallery');
    }
  };

  const handleToggleExpand = () => setIsExpanded((v) => !v);

  const handleZoneClick = (zone) => {
    if (zone.startScene) {
      onNavigate(zone.startScene);
    }
    setIsExpanded(false);
  };

  return {
    isExpanded,
    setIsExpanded,
    projectId,
    navigate,
    handleBack,
    handleToggleExpand,
    handleZoneClick,
  };
}
