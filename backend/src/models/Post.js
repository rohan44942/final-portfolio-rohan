const mongoose = require("mongoose");

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true },
    body: { type: String, default: "", trim: true },
    date: { type: Date, default: Date.now },
    tags: [{ type: String, trim: true }],
    showOnHome: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.pre("validate", function ensureSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }
  next();
});

postSchema.index({ published: 1, showOnHome: 1, order: 1, date: -1 });
postSchema.index({ published: 1, date: -1 });

module.exports = mongoose.model("Post", postSchema);
