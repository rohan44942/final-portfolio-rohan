const env = require("./config/env");
const app = require("./app");
const connectDb = require("./config/db");
const { ensureDefaultAdmin } = require("./services/seedDefaults");

const start = async () => {
  try {
    await connectDb();
    await ensureDefaultAdmin();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
};

start();
