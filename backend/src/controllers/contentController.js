const ContentSection = require("../models/ContentSection");
const asyncHandler = require("../utils/asyncHandler");
const { getCached, setCached, invalidate } = require("../services/publicCache");

const allowedSections = new Set([
  "site-config",
  "home",
  "about",
  "skills",
  "education",
  "experience",
  "social",
  "navbar",
  "routes",
]);

const BOOTSTRAP_SECTIONS = ["home", "social", "navbar", "site-config"];

const setPublicCacheHeaders = (res) => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
};

const getSection = asyncHandler(async (req, res) => {
  const section = req.params.section;
  if (!allowedSections.has(section)) {
    return res.status(404).json({ message: "Unknown section." });
  }

  const cacheKey = `section:${section}`;
  const cached = getCached(cacheKey);
  if (cached) {
    setPublicCacheHeaders(res);
    return res.json(cached);
  }

  const doc = await ContentSection.findOne({ section }).select("data").lean();
  if (!doc) {
    return res.status(404).json({ message: "Section content not found." });
  }

  setCached(cacheKey, doc.data);
  setPublicCacheHeaders(res);
  return res.json(doc.data);
});

const getBootstrap = asyncHandler(async (_req, res) => {
  const cached = getCached("bootstrap");
  if (cached) {
    setPublicCacheHeaders(res);
    return res.json(cached);
  }

  const docs = await ContentSection.find({ section: { $in: BOOTSTRAP_SECTIONS } })
    .select("section data")
    .lean();

  const payload = {
    home: null,
    social: null,
    navbar: null,
    siteConfig: null,
  };

  for (const doc of docs) {
    if (doc.section === "site-config") {
      payload.siteConfig = doc.data;
    } else {
      payload[doc.section] = doc.data;
    }
  }

  setCached("bootstrap", payload);
  setPublicCacheHeaders(res);
  return res.json(payload);
});

const upsertSection = asyncHandler(async (req, res) => {
  const section = req.params.section;
  if (!allowedSections.has(section)) {
    return res.status(404).json({ message: "Unknown section." });
  }

  const doc = await ContentSection.findOneAndUpdate(
    { section },
    { section, data: req.body.data },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  invalidate(`section:${section}`);
  return res.json(doc.data);
});

module.exports = {
  getSection,
  getBootstrap,
  upsertSection,
  allowedSections,
};
