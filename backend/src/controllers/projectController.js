const mongoose = require("mongoose");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const { getCached, setCached, invalidate } = require("../services/publicCache");
const { fetchGithubRepos, mapRepoToProject } = require("../services/githubRepos");
const env = require("../config/env");

const publicProjectFields = "title bodyText image tags links featured visible order createdAt githubName";

const listProjects = asyncHandler(async (_req, res) => {
  const cached = getCached("projects");
  if (cached) {
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.json({ projects: cached });
  }

  const projects = await Project.find({ visible: { $ne: false } })
    .sort({ order: 1, createdAt: -1 })
    .select(publicProjectFields)
    .lean();

  setCached("projects", projects);
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return res.json({ projects });
});

const listAdminProjects = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return res.json({ projects });
});

const findExistingForRepo = async (mapped) => {
  const byGithubId = await Project.findOne({ githubId: mapped.githubId });
  if (byGithubId) {
    return byGithubId;
  }

  const githubUrl = mapped.links.find((link) => /github\.com/i.test(link.href))?.href;
  if (!githubUrl) {
    return null;
  }

  const normalized = githubUrl.replace(/\/+$/, "");
  return Project.findOne({
    $or: [{ "links.href": githubUrl }, { "links.href": normalized }, { "links.href": `${normalized}/` }],
  });
};

const syncGithubProjects = asyncHandler(async (_req, res) => {
  const repos = await fetchGithubRepos();
  let imported = 0;
  let linked = 0;

  for (const repo of repos) {
    const mapped = mapRepoToProject(repo);
    const existing = await findExistingForRepo(mapped);
    if (!existing) {
      await Project.create(mapped);
      imported += 1;
      continue;
    }

    const updates = {};
    if (existing.githubId !== mapped.githubId) {
      updates.githubId = mapped.githubId;
    }
    if (!existing.githubName) {
      updates.githubName = mapped.githubName;
    }
    if (Object.keys(updates).length) {
      await Project.updateOne({ _id: existing._id }, updates);
      linked += 1;
    }
  }

  invalidate("projects");
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return res.json({
    imported,
    linked,
    username: env.githubUsername,
    projects,
  });
});

const setProjectVisibility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid project id." });
  }

  const updated = await Project.findByIdAndUpdate(
    id,
    { visible: req.body.visible },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!updated) {
    return res.status(404).json({ message: "Project not found." });
  }

  invalidate("projects");
  return res.json(updated);
});

const createProject = asyncHandler(async (req, res) => {
  const created = await Project.create(req.body);
  invalidate("projects");
  return res.status(201).json(created);
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid project id." });
  }

  const updated = await Project.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    return res.status(404).json({ message: "Project not found." });
  }

  invalidate("projects");
  return res.json(updated);
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid project id." });
  }

  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Project not found." });
  }

  invalidate("projects");
  return res.status(204).send();
});

module.exports = {
  listProjects,
  listAdminProjects,
  syncGithubProjects,
  setProjectVisibility,
  createProject,
  updateProject,
  deleteProject,
};
