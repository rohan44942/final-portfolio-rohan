const mongoose = require("mongoose");
const env = require("./env");

const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  await mongoose.connect(env.mongoUri);
};

module.exports = connectDb;
