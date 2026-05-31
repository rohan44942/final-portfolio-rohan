const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, unique: true, index: true },
    storage: { type: String, enum: ["cloudinary", "mongodb"], required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, default: "" },
    cloudinaryPublicId: { type: String, default: "" },
    binaryData: { type: Buffer, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
