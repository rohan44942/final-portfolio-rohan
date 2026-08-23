const { isAllowedOrigin } = require("../utils/allowedOrigins");

const applyCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
};

const notFoundHandler = (req, res) => {
  applyCorsHeaders(req, res);
  res.status(404).json({ message: "Route not found." });
};

const errorHandler = (error, req, res, _next) => {
  applyCorsHeaders(req, res);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";
  res.status(statusCode).json({ message });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
