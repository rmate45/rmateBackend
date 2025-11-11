const mongoose = require("mongoose");

const topFinancialPlanningSchema = new mongoose.Schema(
  {
    planningId: {
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
    collection: "TopFinancialPlanning",
  }
);

// Create index for sorting and querying
topFinancialPlanningSchema.index({ planningId: 1 });

module.exports = mongoose.model(
  "TopFinancialPlanning",
  topFinancialPlanningSchema
);
