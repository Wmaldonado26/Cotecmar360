export const getOrderedVisibleZones = (project) => {
  if (!project || !Array.isArray(project.experiences)) {
    return [];
  }
  return project.experiences.filter(zone => zone.visible !== false);
};
