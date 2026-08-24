import { FaHome, FaMapMarkerAlt, FaShip } from "react-icons/fa";

const STEPS = [
  { key: "home", label: "Inicio", icon: <FaHome /> },
  { key: "project", label: "Proyecto", icon: <FaShip /> },
  { key: "viewer", label: "Vista 360°", icon: <FaMapMarkerAlt /> },
];

const STEP_INDEX = {
  home: 0,
  project: 1,
  viewer: 2,
};

export default function useProgressBreadcrumbLogic(props) {
  const { activeStep = "home", className = "" } = props;

  const currentIndex = STEP_INDEX[activeStep] ?? 0;
  const visibleSteps = STEPS.slice(0, currentIndex + 1);
  const navClassName = `progress-breadcrumb ${className}`.trim();

  const buildStepData = () => visibleSteps.map((step, index) => ({
    step,
    index,
    isActive: index === currentIndex,
    isCompleted: index < currentIndex,
    showSeparator: index < visibleSteps.length - 1,
    separatorIsActive: index < currentIndex,
  }));

  return {
    currentIndex,
    navClassName,
    buildStepData,
  };
}
