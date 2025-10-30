const mongoose = require("mongoose");

const userDemographicSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    income: {
      type: Number,
      required: true,
      min: 0,
    },
    savings: {
      type: Number,
      required: true,
      min: 0,
    },
    zipCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{5}(-\d{4})?$/.test(v);
        },
        message: "ZIP code must be in format 12345 or 12345-6789",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for better performance
userDemographicSchema.index({ zipCode: 1 });
userDemographicSchema.index({ createdAt: -1 });

module.exports = mongoose.model("UserDemographic", userDemographicSchema);
