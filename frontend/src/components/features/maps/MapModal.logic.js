import { useMemo } from 'react';

const SCENE_POSITIONS = {
  insideOne: { x: 50, y: 20, name: "Puente de Gobierno", area: "Superestructura" },
  insideTwo: { x: 30, y: 40, name: "Cubierta Bote Crujia Proa", area: "Cubierta" },
  insideThree: { x: 70, y: 40, name: "Cubierta Bote Crujia Proa Babor", area: "Cubierta" },
  insideFour: { x: 20, y: 60, name: "Proa Costado Babor", area: "Proa" },
  insideFive: { x: 80, y: 60, name: "Proa Costado Estribor", area: "Proa" },
  insideSix: { x: 40, y: 50, name: "Cubierta Principal Costado Babor", area: "Cubierta" },
  insideSeven: { x: 60, y: 50, name: "Cubierta Principal Costado Estribor", area: "Cubierta" },
  insideEight: { x: 50, y: 45, name: "Cubierta De Trabajo", area: "Cubierta" },
  insideNine: { x: 30, y: 55, name: "Cabrestante Costado Babor", area: "Equipos" },
  insideTen: { x: 70, y: 55, name: "Cabrestante Costado Estribor", area: "Equipos" },
  insideEleven: { x: 25, y: 35, name: "Cubierta Bote Costado Babor Proa", area: "Cubierta" },
  insideTwelve: { x: 75, y: 35, name: "Cubierta Bote Costado Babor", area: "Cubierta" },
  insideThirteen: { x: 50, y: 80, name: "Cuarto de Maquinas Costado Babor Popa", area: "Maquinaria" },
  insideFourteen: { x: 50, y: 75, name: "Cuarto de Maquinas Costado Babor Proa", area: "Maquinaria" },
  insideFifteen: { x: 50, y: 70, name: "Cubierta Superior Cuarto De Maquinas", area: "Maquinaria" },
  insideSixteen: { x: 50, y: 85, name: "Cuarto De Maquinas Costado Estribor", area: "Maquinaria" },
  insideSeventeen: { x: 45, y: 82, name: "Servo Motor Crujia", area: "Maquinaria" },
  insideEighteen: { x: 40, y: 82, name: "Servo Motor Costado Babor", area: "Maquinaria" },
  insideNineteen: { x: 60, y: 82, name: "Servo Motor Costado Estribor", area: "Maquinaria" },
};

const AREA_COLORS = {
  Superestructura: "#3b82f6",
  Cubierta: "#10b981",
  Proa: "#f59e0b",
  Equipos: "#8b5cf6",
  Maquinaria: "#ef4444",
};

function kebabArea(area) {
  return area
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function useMapModalLogic({ isOpen, onClose, scenes, currentScene, onSceneSelect }) {
  const areaColors = useMemo(() => {
    const entries = Object.entries(AREA_COLORS).map(([area, color]) => ({
      area,
      color,
      className: `legend-color-modal--${kebabArea(area)}`,
    }));
    return entries;
  }, []);

  const sceneEntries = useMemo(() => Object.entries(SCENE_POSITIONS), []);

  const getAreaColor = (area) => AREA_COLORS[area] || "#64748b";
  const getLegendClass = (area) => `legend-color-modal legend-color-modal--${kebabArea(area)}`;

  const scenePositions = SCENE_POSITIONS;

  return {
    scenePositions,
    sceneEntries,
    getAreaColor,
    getLegendClass,
    areaColors,
  };
}
