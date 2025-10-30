const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    totalArticleContent: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "retirement_planning",
        "investment",
        "social_security",
        "tax_planning",
        "healthcare",
        "lifestyle",
      ],
    },
    readTime: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    featuredImage: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

// Index for better performance
articleSchema.index({ category: 1 });
articleSchema.index({ isPublished: 1 });
articleSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Article", articleSchema);
