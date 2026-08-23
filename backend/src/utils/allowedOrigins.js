const env = require("../config/env");

const parseOrigins = () =>
  env.frontendUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }
  if (parseOrigins().includes(origin)) {
    return true;
  }
  try {
    const { hostname } = new URL(origin);
    return hostname === "vercel.app" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

module.exports = parseOrigins;
module.exports.isAllowedOrigin = isAllowedOrigin;
