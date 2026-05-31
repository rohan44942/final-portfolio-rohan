const mongoose = require("mongoose");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const listProjects = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return res.json({ projects });
});

const createProject = asyncHandler(async (req, res) => {
  const created = await Project.create(req.body);
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

  return res.status(204).send();
});

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
};
