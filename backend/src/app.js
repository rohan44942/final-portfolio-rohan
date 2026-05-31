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
const parseOrigins = require("./utils/allowedOrigins");

const app = express();

const corsOrigins = parseOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked for this origin."));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
