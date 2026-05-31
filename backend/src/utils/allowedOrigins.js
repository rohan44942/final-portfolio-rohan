const env = require("../config/env");

const parseOrigins = () =>
  env.frontendUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

module.exports = parseOrigins;
