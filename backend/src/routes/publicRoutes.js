const express = require("express");
const { getSection, getBootstrap } = require("../controllers/contentController");
const { listProjects } = require("../controllers/projectController");

const router = express.Router();

router.get("/content/bootstrap", getBootstrap);
router.get("/content/projects", listProjects);
router.get("/content/:section", getSection);

module.exports = router;
