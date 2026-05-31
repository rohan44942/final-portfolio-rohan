const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-env",
  jwtExpiry: process.env.JWT_EXPIRY || "1d",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  frontendUrls: process.env.FRONTEND_URLS || "http://localhost:5173",
};

module.exports = env;
