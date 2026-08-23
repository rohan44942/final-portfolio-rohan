const mongoose = require("mongoose");

const projectLinkSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    bodyText: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    links: [projectLinkSchema],
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    githubId: { type: Number, sparse: true, unique: true },
    githubName: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1, createdAt: -1 });
projectSchema.index({ visible: 1, order: 1 });

module.exports = mongoose.model("Project", projectSchema);
