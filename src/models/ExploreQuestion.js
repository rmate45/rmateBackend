const mongoose = require("mongoose");

const exploreQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: [String],
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "ExploreQuestion",
  }
);

// Create index for sorting and querying
exploreQuestionSchema.index({ questionId: 1 });
exploreQuestionSchema.index({ category: 1 });

module.exports = mongoose.model("ExploreQuestion", exploreQuestionSchema);
