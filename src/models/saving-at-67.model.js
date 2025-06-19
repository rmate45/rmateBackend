const mongoose = require('mongoose');

const lifestyleRangeSchema = new mongoose.Schema({
  min: Number,
  max: Number,
  mean: Number
}, { _id: false });

const savingAt67 = new mongoose.Schema({
  state: { type: String, required: true, unique: true },

  budget: lifestyleRangeSchema,
  comfort: lifestyleRangeSchema,
  luxury: lifestyleRangeSchema,

  medianLifestyle: Number
}, { timestamps: true });

module.exports = mongoose.model('savings-at-67', savingAt67);
