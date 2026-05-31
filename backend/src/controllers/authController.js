const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiry }
  );

  return res.json({ token });
});

const me = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.sub).select("email createdAt");
  if (!admin) {
    return res.status(404).json({ message: "Admin not found." });
  }

  return res.json({ admin });
});

module.exports = {
  login,
  me,
};
