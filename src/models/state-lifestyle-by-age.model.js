const mongoose = require('mongoose');

const StateLifestyleByAgeSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    index: true,
  },
  age: {
    type: Number,
    required: true,
  },
  yearsRemaining: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  comfort: {
    type: Number,
    required: true,
  },
  luxury: {
    type: Number,
    required: true,
  },
  medianLife: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('state-lifestyle-by-age', StateLifestyleByAgeSchema);
