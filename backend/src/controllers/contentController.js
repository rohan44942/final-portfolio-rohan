const ContentSection = require("../models/ContentSection");
const asyncHandler = require("../utils/asyncHandler");

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

const getSection = asyncHandler(async (req, res) => {
  const section = req.params.section;
  if (!allowedSections.has(section)) {
    return res.status(404).json({ message: "Unknown section." });
  }

  const doc = await ContentSection.findOne({ section }).lean();
  if (!doc) {
    return res.status(404).json({ message: "Section content not found." });
  }

  return res.json(doc.data);
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

  return res.json(doc.data);
});

module.exports = {
  getSection,
  upsertSection,
  allowedSections,
};
