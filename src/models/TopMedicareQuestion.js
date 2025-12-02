const mongoose = require("mongoose");

const topMedicareQuestionSchema = new mongoose.Schema(
  {
    medicareQuestionId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    savings: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "TopMedicareQuestion",
  }
);

// Create index for sorting and querying
topMedicareQuestionSchema.index({ medicareQuestionId: 1 });

module.exports = mongoose.model(
  "TopMedicareQuestion",
  topMedicareQuestionSchema
);
