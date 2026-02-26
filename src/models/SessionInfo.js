const mongoose = require("mongoose");

const sessionInfoSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sessionStartTimestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    sessionEndTimestamp: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        questionText: {
          type: String,
          required: true,
        },
        answerSelected: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

sessionInfoSchema.index({ sessionId: 1, "answers.timestamp": -1 });

module.exports = mongoose.model("SessionInfo", sessionInfoSchema);
