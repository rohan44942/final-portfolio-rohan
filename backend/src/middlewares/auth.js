const jwt = require("jsonwebtoken");
const env = require("../config/env");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token." });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.admin = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token." });
  }
};

module.exports = requireAuth;
