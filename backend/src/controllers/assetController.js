const streamifier = require("streamifier");
const Asset = require("../models/Asset");
const asyncHandler = require("../utils/asyncHandler");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        resource_type: "raw",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "resume file is required." });
  }

  let updateDoc = {
    kind: "resume",
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    updatedAt: new Date(),
  };

  if (isCloudinaryConfigured) {
    const uploaded = await uploadToCloudinary(req.file);
    updateDoc = {
      ...updateDoc,
      storage: "cloudinary",
      url: uploaded.secure_url,
      cloudinaryPublicId: uploaded.public_id,
      binaryData: null,
    };
  } else {
    updateDoc = {
      ...updateDoc,
      storage: "mongodb",
      url: "",
      cloudinaryPublicId: "",
      binaryData: req.file.buffer,
    };
  }

  const asset = await Asset.findOneAndUpdate({ kind: "resume" }, updateDoc, {
    upsert: true,
    new: true,
    runValidators: true,
  }).lean();

  return res.status(201).json({
    kind: asset.kind,
    storage: asset.storage,
    fileName: asset.fileName,
    size: asset.size,
    url: asset.url,
    downloadUrl: "/api/content/resume/file",
  });
});

const getResumeMetadata = asyncHandler(async (_req, res) => {
  const asset = await Asset.findOne({ kind: "resume" }).lean();
  if (!asset) {
    return res.status(404).json({ message: "Resume not found." });
  }

  return res.json({
    kind: asset.kind,
    storage: asset.storage,
    fileName: asset.fileName,
    size: asset.size,
    url: asset.url,
    downloadUrl: "/api/content/resume/file",
    updatedAt: asset.updatedAt,
  });
});

const streamResume = asyncHandler(async (_req, res) => {
  const asset = await Asset.findOne({ kind: "resume" });
  if (!asset) {
    return res.status(404).json({ message: "Resume not found." });
  }

  if (asset.storage === "cloudinary" && asset.url) {
    return res.redirect(asset.url);
  }

  if (!asset.binaryData) {
    return res.status(404).json({ message: "Resume file payload not found." });
  }

  res.setHeader("Content-Type", asset.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${asset.fileName}"`);
  return res.send(asset.binaryData);
});

module.exports = {
  uploadResume,
  getResumeMetadata,
  streamResume,
};
