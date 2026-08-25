const fs = require("fs/promises");
const path = require("path");
const connectDb = require("../config/db");
const ContentSection = require("../models/ContentSection");
const Post = require("../models/Post");

const repoRoot = path.resolve(__dirname, "../../..");
const dataDir = path.join(repoRoot, "frontend", "src", "data");
const profileDir = path.join(repoRoot, "frontend", "public", "profile");

const readJson = async (fileName) => {
  const candidates = [path.join(dataDir, fileName), path.join(profileDir, fileName)];
  let lastError;
  for (const fullPath of candidates) {
    try {
      const raw = await fs.readFile(fullPath, "utf-8");
      return JSON.parse(raw);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

const seed = async () => {
  await connectDb();
  const writingJson = await readJson("writing.json");

  for (const post of writingJson.posts || []) {
    await Post.findOneAndUpdate(
      { slug: post.slug },
      post,
      { upsert: true, returnDocument: "after", runValidators: true }
    );
  }

  await ContentSection.findOneAndUpdate(
    { section: "site-config" },
    { $set: { "data.showWriting": true } },
    { upsert: false, returnDocument: "after" }
  );

  // eslint-disable-next-line no-console
  console.log("Writing JSON successfully seeded to MongoDB.");
  process.exit(0);
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Writing seed failed:", error.message);
  process.exit(1);
});
