const { Router } = require("express");
const projectsController = require("../controllers/projects.controller");
const {
  requireAuth,
  requireRole,
  ensureProjectAccess,
} = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../utils/errors");

const router = Router();
const zonesRoutes = require("./zones.routes");

router.use("/:projectId/zones", zonesRoutes);

router.get("/", requireAuth, asyncHandler(projectsController.listProjects));

router.get("/public", asyncHandler(async (req, res) => {
  const prisma = require("../config/prisma");
  const { hydrateProject } = require("../utils/project");
  const allProjects = await prisma.project.findMany({
    where: { status: "active" },
    orderBy: { dateModified: "desc" },
  });
  const hydrated = allProjects.map(hydrateProject);
  const publicProjects = hydrated.filter(p => p.settings?.showInLandingList === true);
  res.json(publicProjects);
}));

router.get("/public/:id", asyncHandler(async (req, res) => {
  const projectService = require("../services/project.service");
  const { createHttpError } = require("../utils/errors");
  const project = await projectService.getProjectById(req.params.id);
  if (!project) throw createHttpError(404, "Proyecto no encontrado");
  res.json(project);
}));

router.get("/:id", requireAuth, asyncHandler(ensureProjectAccess), asyncHandler(projectsController.getProject));
router.post("/", requireAuth, requireRole("admin", "project_admin"), asyncHandler(projectsController.createProject));
router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "project_admin"),
  asyncHandler(projectsController.updateProject)
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "project_admin"),
  asyncHandler(projectsController.deleteProject)
);

module.exports = router;
