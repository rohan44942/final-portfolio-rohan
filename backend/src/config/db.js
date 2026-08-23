const mongoose = require("mongoose");
const env = require("./env");

const cache = globalThis.__portfolioMongoose || { conn: null, promise: null };
globalThis.__portfolioMongoose = cache;

const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.mongoUri, {
      maxPoolSize: 5,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};

module.exports = connectDb;
