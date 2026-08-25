const express = require("express");
const requireAuth = require("../middlewares/auth");
const validateBody = require("../middlewares/validate");
const { upsertSection } = require("../controllers/contentController");
const {
  createProject,
  updateProject,
  deleteProject,
  listAdminProjects,
  syncGithubProjects,
  setProjectVisibility,
} = require("../controllers/projectController");
const {
  createPost,
  deletePost,
  listAdminPosts,
  setPostHomepage,
  updatePost,
} = require("../controllers/postController");
const {
  postHomepageSchema,
  postSchema,
  projectSchema,
  projectVisibilitySchema,
  upsertSectionSchema,
} = require("../schemas/adminSchemas");

const router = express.Router();

router.use(requireAuth);

router.put("/content/:section", validateBody(upsertSectionSchema), upsertSection);
router.get("/projects", listAdminProjects);
router.post("/github/sync", syncGithubProjects);
router.patch("/projects/:id/visibility", validateBody(projectVisibilitySchema), setProjectVisibility);
router.post("/projects", validateBody(projectSchema), createProject);
router.put("/projects/:id", validateBody(projectSchema), updateProject);
router.delete("/projects/:id", deleteProject);
router.get("/posts", listAdminPosts);
router.patch("/posts/:id/homepage", validateBody(postHomepageSchema), setPostHomepage);
router.post("/posts", validateBody(postSchema), createPost);
router.put("/posts/:id", validateBody(postSchema), updatePost);
router.delete("/posts/:id", deletePost);

module.exports = router;
