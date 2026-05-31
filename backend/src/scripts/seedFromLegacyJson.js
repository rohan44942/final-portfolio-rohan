const fs = require("fs/promises");
const path = require("path");
const connectDb = require("../config/db");
const ContentSection = require("../models/ContentSection");
const Project = require("../models/Project");
const { ensureDefaultAdmin } = require("../services/seedDefaults");

const repoRoot = path.resolve(__dirname, "../../..");
const profileDir = path.join(repoRoot, "public", "profile");

const sectionMap = [
  { file: "home.json", key: "home" },
  { file: "about.json", key: "about" },
  { file: "skills.json", key: "skills" },
  { file: "education.json", key: "education" },
  { file: "experiences.json", key: "experience" },
  { file: "social.json", key: "social" },
  { file: "navbar.json", key: "navbar" },
  { file: "routes.json", key: "routes" },
];

const readJson = async (fileName) => {
  const fullPath = path.join(profileDir, fileName);
  const raw = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(raw);
};

const upsertSection = async (section, data) => {
  await ContentSection.findOneAndUpdate(
    { section },
    { section, data },
    { upsert: true, new: true, runValidators: true }
  );
};

const seed = async () => {
  await connectDb();
  await ensureDefaultAdmin();

  for (const item of sectionMap) {
    const data = await readJson(item.file);
    await upsertSection(item.key, data);
  }

  const projectsJson = await readJson("projects.json");
  await Project.deleteMany({});
  await Project.insertMany(
    (projectsJson.projects || []).map((project, index) => ({
      ...project,
      order: index,
    }))
  );

  // eslint-disable-next-line no-console
  console.log("Legacy JSON successfully seeded to MongoDB.");
  process.exit(0);
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed:", error.message);
  process.exit(1);
});
