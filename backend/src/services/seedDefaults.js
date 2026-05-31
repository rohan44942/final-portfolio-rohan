const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const env = require("../config/env");

const ensureDefaultAdmin = async () => {
  const existing = await Admin.findOne({ email: env.adminEmail.toLowerCase() });
  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  return Admin.create({
    email: env.adminEmail.toLowerCase(),
    passwordHash,
  });
};

module.exports = {
  ensureDefaultAdmin,
};
