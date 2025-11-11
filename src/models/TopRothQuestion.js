const mongoose = require("mongoose");

const topRothQuestionSchema = new mongoose.Schema(
  {
    rothQuestionId: {
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
  },
  {
    timestamps: true,
  }
);

// Create index for sorting and querying
topRothQuestionSchema.index({ rothQuestionId: 1 });

module.exports = mongoose.model("TopRothQuestion", topRothQuestionSchema);
