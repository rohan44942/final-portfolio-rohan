const mongoose = require("mongoose");

const contentSectionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContentSection", contentSectionSchema);
