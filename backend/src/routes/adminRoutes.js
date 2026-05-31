const express = require("express");
const requireAuth = require("../middlewares/auth");
const validateBody = require("../middlewares/validate");
const upload = require("../middlewares/upload");
const { upsertSection } = require("../controllers/contentController");
const { createProject, updateProject, deleteProject } = require("../controllers/projectController");
const { uploadResume } = require("../controllers/assetController");
const { upsertSectionSchema, projectSchema } = require("../schemas/adminSchemas");

const router = express.Router();

router.use(requireAuth);

router.put("/content/:section", validateBody(upsertSectionSchema), upsertSection);
router.post("/projects", validateBody(projectSchema), createProject);
router.put("/projects/:id", validateBody(projectSchema), updateProject);
router.delete("/projects/:id", deleteProject);
router.post("/assets/resume", upload.single("resume"), uploadResume);

module.exports = router;
