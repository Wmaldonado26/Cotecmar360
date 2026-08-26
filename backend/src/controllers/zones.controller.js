const zonesService = require("../services/zones.service");

async function deleteZone(req, res) {
  const { projectId, zoneId } = req.params;
  const payload = await zonesService.deleteZoneCascade(projectId, zoneId, req.user);
  res.json(payload);
}

module.exports = {
  deleteZone,
};
