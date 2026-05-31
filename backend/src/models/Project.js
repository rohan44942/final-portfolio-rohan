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
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
