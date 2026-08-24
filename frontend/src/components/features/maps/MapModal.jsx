import React from 'react';
import './MapModal.css';
import { FaTimes } from 'react-icons/fa';

const MapModalView = ({
  isOpen,
  onClose,
  scenes,
  currentScene,
  onSceneSelect,
  sceneEntries,
  getAreaColor,
  getLegendClass,
  areaColors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="map-modal-backdrop" onClick={onClose}>
      <div className="map-modal" onClick={(e) => e.stopPropagation()}>
        <div className="map-modal-header">
          <h3>🗺️ Navegación del Barco</h3>
          <button className="map-modal-close" onClick={onClose} aria-label="Cerrar">
            <FaTimes />
          </button>
        </div>

        <div className="map-modal-body">
          <div className="map-container-modal">
            <svg viewBox="0 0 100 100" className="ship-map-modal">
              <rect x="10" y="15" width="80" height="70" fill="none" stroke="#64748b" strokeWidth="0.5" rx="5" className="ship-outline" />
              <rect x="15" y="20" width="70" height="15" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="0.3" rx="2" />
              <text x="50" y="28" textAnchor="middle" className="area-label">Superestructura</text>
              <rect x="15" y="35" width="70" height="20" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="0.3" rx="2" />
              <text x="50" y="45" textAnchor="middle" className="area-label">Cubierta</text>
              <rect x="15" y="55" width="70" height="10" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" strokeWidth="0.3" rx="2" />
              <text x="50" y="62" textAnchor="middle" className="area-label">Proa</text>
              <rect x="15" y="65" width="70" height="20" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="0.3" rx="2" />
              <text x="50" y="75" textAnchor="middle" className="area-label">Maquinaria</text>

              {sceneEntries.map(([sceneId, position]) => (
                <g key={sceneId}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="2.5"
                    fill={currentScene === sceneId ? "#ffffff" : getAreaColor(position.area)}
                    stroke={currentScene === sceneId ? "#3b82f6" : "#ffffff"}
                    strokeWidth={currentScene === sceneId ? "0.6" : "0.3"}
                    className="scene-point-modal"
                    onClick={() => onSceneSelect(sceneId)}
                  />
                  {currentScene === sceneId && (
                    <circle cx={position.x} cy={position.y} r="4" fill="none" stroke="#3b82f6" strokeWidth="0.5" className="current-scene-indicator" />
                  )}
                </g>
              ))}
            </svg>
          </div>

          <div className="map-legend-modal">
            <h4>Leyenda de Áreas</h4>
            {areaColors.map(({ area, className: legendColorClassName }) => (
              <div key={area} className="legend-item-modal">
                <div className={legendColorClassName}></div>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModalView;
