const env = require("../config/env");

const LOCAL_DEV_PORTS = new Set(["4173", "5173", "5174", "5175", "5176"]);

const parseOrigins = () =>
  env.frontendUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

const isLocalDevOrigin = (origin) => {
  try {
    const { hostname, port } = new URL(origin);
    return (
      (hostname === "localhost" || hostname === "127.0.0.1") &&
      LOCAL_DEV_PORTS.has(port)
    );
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }
  if (parseOrigins().includes(origin)) {
    return true;
  }
  if (isLocalDevOrigin(origin)) {
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
