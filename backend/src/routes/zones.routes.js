const { Router } = require("express");
const zonesController = require("../controllers/zones.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../utils/errors");

const router = Router({ mergeParams: true }); // mergeParams to get projectId from parent router

router.delete(
  "/:zoneId",
  requireAuth,
  requireRole("admin", "project_admin"),
  asyncHandler(zonesController.deleteZone)
);

module.exports = router;
