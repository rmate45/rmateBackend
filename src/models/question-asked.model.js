const mongoose = require("mongoose");

const retirementQuestionSchema = new mongoose.Schema(
  {
    retirementQuestionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `RQ${Date.now()}${Math.floor(Math.random() * 1000)}`,
    },
    question: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "question-asked",
  }
);

// Create index for sorting
retirementQuestionSchema.index({ sortOrder: 1 });

module.exports = mongoose.model("question-asked", retirementQuestionSchema);
