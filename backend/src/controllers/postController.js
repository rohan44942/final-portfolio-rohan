const mongoose = require("mongoose");
const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");
const { getCached, setCached, invalidate } = require("../services/publicCache");

const publicPostFields = "title slug excerpt body date tags showOnHome order createdAt";
const publicSort = { order: 1, date: -1, createdAt: -1 };

const cleanPostPayload = (payload) => {
  const next = { ...payload };
  if (!String(next.slug || "").trim()) {
    delete next.slug;
  }
  return next;
};

const setPublicCacheHeaders = (res) => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
};

const listPosts = asyncHandler(async (_req, res) => {
  const cached = getCached("posts");
  if (cached) {
    setPublicCacheHeaders(res);
    return res.json({ posts: cached });
  }

  const posts = await Post.find({ published: true }).sort(publicSort).select(publicPostFields).lean();
  setCached("posts", posts);
  setPublicCacheHeaders(res);
  return res.json({ posts });
});

const getPostBySlug = asyncHandler(async (req, res) => {
  const slug = String(req.params.slug || "").trim().toLowerCase();
  const cacheKey = `post:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) {
    setPublicCacheHeaders(res);
    return res.json(cached);
  }

  const post = await Post.findOne({ slug, published: true }).select(publicPostFields).lean();
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  setCached(cacheKey, post);
  setPublicCacheHeaders(res);
  return res.json(post);
});

const listAdminPosts = asyncHandler(async (_req, res) => {
  const posts = await Post.find().sort(publicSort).lean();
  return res.json({ posts });
});

const createPost = asyncHandler(async (req, res) => {
  const created = await Post.create(cleanPostPayload(req.body));
  invalidate();
  return res.status(201).json(created);
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id." });
  }

  const updated = await Post.findByIdAndUpdate(id, cleanPostPayload(req.body), {
    returnDocument: "after",
    runValidators: true,
  }).lean();

  if (!updated) {
    return res.status(404).json({ message: "Post not found." });
  }

  invalidate();
  return res.json(updated);
});

const setPostHomepage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id." });
  }

  const updated = await Post.findByIdAndUpdate(
    id,
    { showOnHome: req.body.showOnHome },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!updated) {
    return res.status(404).json({ message: "Post not found." });
  }

  invalidate();
  return res.json(updated);
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id." });
  }

  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Post not found." });
  }

  invalidate();
  return res.status(204).send();
});

module.exports = {
  listPosts,
  getPostBySlug,
  listAdminPosts,
  createPost,
  updatePost,
  setPostHomepage,
  deletePost,
};
