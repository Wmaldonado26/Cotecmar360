import React from "react";
import { FaArrowLeft, FaMapMarkedAlt, FaCircle } from "react-icons/fa";
import "./NavigationHistory.css";

const NavigationHistoryView = ({
  currentScene,
  onNavigate,
  onBack,
  showBack = true,
  experiences = [],
  activeZoneId,
  isExpanded,
  handleBack,
  handleToggleExpand,
  handleZoneClick,
}) => {
  return (
    <div className="navigation-history">
      {showBack && (
        <button
          className="back-button enabled"
          onClick={handleBack}
          title="Volver a la vista anterior"
        >
          <span className="back-icon"><FaArrowLeft /></span>
          <span className="back-text">Atrás</span>
        </button>
      )}

      <button
        className="history-toggle"
        onClick={handleToggleExpand}
        title="Ver Zonas"
      >
        <span className="history-icon"><FaMapMarkedAlt /></span>
      </button>

      {isExpanded && (
        <div className="history-panel">
          <div className="history-header">
            <h4>Zonas Disponibles</h4>
          </div>
          <div className="history-list">
            {experiences.map((zone, index) => {
              const isCurrent = zone.id === activeZoneId;
              return (
                <div
                  key={`${zone.id}-${index}`}
                  className={`history-item ${isCurrent ? "current" : ""}`}
                  onClick={() => handleZoneClick(zone)}
                >
                  <FaCircle className={`status-dot ${isCurrent ? "active" : ""}`} />
                  <span className="scene-name">{zone.name}</span>
                </div>
              );
            })}
            {experiences.length === 0 && (
              <div className="history-empty">
                No hay zonas configuradas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationHistoryView;
