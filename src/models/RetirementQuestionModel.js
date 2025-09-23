const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: "",
  },
});

const retirementQuestionSchema = new mongoose.Schema(
  {
    ageGroup: {
      type: String,
      required: true,
      enum: [
        "18-24",
        "25-34",
        "35-44",
        "45-54",
        "55-64",
        "65-74",
        "75-84",
        "85+",
      ],
    },
    prompt: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Both", "Female", "Male"],
    },
    position: {
      type: Number,
      required: true,
    },
    inputType: {
      type: String,
      enum: ["free_text", "single_select", "multi_select"],
      default: "free_text",
    },
    options: [optionSchema],
    defaultComment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to normalize ageGroup values
retirementQuestionSchema.pre("save", function (next) {
  if (this.ageGroup) {
    // Replace en dash and em dash with regular dash
    this.ageGroup = this.ageGroup
      .replace(/–/g, "-") // en dash to regular dash
      .replace(/—/g, "-"); // em dash to regular dash
  }

  // Normalize gender case
  if (this.gender) {
    const genderLower = this.gender.toLowerCase();
    if (genderLower === "both") this.gender = "Both";
    else if (genderLower === "female") this.gender = "Female";
    else if (genderLower === "male") this.gender = "Male";
  }

  next();
});

// Compound index for efficient querying
retirementQuestionSchema.index({ ageGroup: 1, gender: 1, position: 1 });

module.exports = mongoose.model("RetirementQuestion", retirementQuestionSchema);
