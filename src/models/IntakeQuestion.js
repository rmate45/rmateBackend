const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    comment: [String],
    actionTypeA: String,
    actionTypeB: String,
  },
  { _id: false }
);

const intakeQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    inputType: {
      type: String,
      enum: ["free_text", "single_select", "multi_select"],
      required: true,
    },
    defaultComment: String,
    options: [optionSchema],
    position: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create index for ordering
intakeQuestionSchema.index({ position: 1 });

module.exports = mongoose.model("IntakeQuestion", intakeQuestionSchema);
