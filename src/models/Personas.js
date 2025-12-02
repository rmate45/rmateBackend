const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema(
  {
    persona_id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Primary", "Secondary"], // Assuming you might have Secondary types later
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    ethnicity: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    annual_income: {
      type: Number,
      required: true,
      min: 0,
    },
    total_savings: {
      type: Number,
      required: true,
      min: 0,
    },
    persona_description: {
      type: String,
      required: true,
    },
    persona_question: {
      type: String,
      required: true,
    },
    chat_bubble: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: Add index for better query performance
personaSchema.index({ persona_id: 1 });
personaSchema.index({ type: 1 });
personaSchema.index({ age: 1 });

module.exports = mongoose.model("Personas", personaSchema);
