const express = require("express");
const { getSection, getBootstrap } = require("../controllers/contentController");
const { listProjects } = require("../controllers/projectController");
const { getPostBySlug, listPosts } = require("../controllers/postController");

const router = express.Router();

router.get("/content/bootstrap", getBootstrap);
router.get("/content/projects", listProjects);
router.get("/content/posts", listPosts);
router.get("/content/posts/:slug", getPostBySlug);
router.get("/content/:section", getSection);

module.exports = router;
