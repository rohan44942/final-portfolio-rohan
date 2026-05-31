const express = require("express");
const { login, me } = require("../controllers/authController");
const validateBody = require("../middlewares/validate");
const requireAuth = require("../middlewares/auth");
const { loginSchema } = require("../schemas/adminSchemas");

const router = express.Router();

router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, me);

module.exports = router;
