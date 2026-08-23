const fs = require("fs/promises");
const path = require("path");
const connectDb = require("../config/db");
const ContentSection = require("../models/ContentSection");
const Project = require("../models/Project");
const { ensureDefaultAdmin } = require("../services/seedDefaults");

const repoRoot = path.resolve(__dirname, "../../..");
const dataDir = path.join(repoRoot, "frontend", "src", "data");
const profileDir = path.join(repoRoot, "frontend", "public", "profile");

const sectionMap = [
  { file: "home.json", key: "home" },
  { file: "about.json", key: "about" },
  { file: "skills.json", key: "skills" },
  { file: "education.json", key: "education" },
  { file: "experience.json", key: "experience" },
  { file: "social.json", key: "social" },
  { file: "navbar.json", key: "navbar" },
  { file: "routes.json", key: "routes" },
];

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

const upsertSection = async (section, data) => {
  await ContentSection.findOneAndUpdate(
    { section },
    { section, data },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
};

const seed = async () => {
  await connectDb();
  await ensureDefaultAdmin();

  for (const item of sectionMap) {
    const data = await readJson(item.file);
    await upsertSection(item.key, data);
  }

  const navbar = await readJson("navbar.json");
  const resumeLink = (navbar.sections || []).find(
    (section) => section.type === "link" && String(section.title || "").toLowerCase().includes("resume")
  );

  let siteConfig = {
    resumeUrl: resumeLink?.href || "",
  };
  try {
    const fromFile = await readJson("site-config.json");
    siteConfig = {
      ...siteConfig,
      ...fromFile,
      resumeUrl: fromFile.resumeUrl || resumeLink?.href || "",
    };
  } catch {
    // Optional file — keep navbar-derived resume URL.
  }
  await upsertSection("site-config", siteConfig);

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
