const express = require("express");
const { getSection, getBootstrap } = require("../controllers/contentController");
const { listProjects } = require("../controllers/projectController");
const { getResumeMetadata, streamResume } = require("../controllers/assetController");

const router = express.Router();

router.get("/content/bootstrap", getBootstrap);
router.get("/content/projects", listProjects);
router.get("/content/resume", getResumeMetadata);
router.get("/content/resume/file", streamResume);
router.get("/content/:section", getSection);

module.exports = router;
