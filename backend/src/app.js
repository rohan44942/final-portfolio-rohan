const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/error");
const { isAllowedOrigin } = require("./utils/allowedOrigins");
const connectDb = require("./config/db");
const { ensureDefaultAdmin } = require("./services/seedDefaults");

const app = express();
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
  })
);

app.get(["/health", "/api/health"], (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true });
});

let bootPromise;
app.use(async (_req, _res, next) => {
  try {
    if (!bootPromise) {
      bootPromise = (async () => {
        await connectDb();
        await ensureDefaultAdmin();
      })();
    }
    await bootPromise;
    next();
  } catch (error) {
    next(error);
  }
});

app.use(helmet());
app.use(morgan(isProd ? "tiny" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 400 : 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
