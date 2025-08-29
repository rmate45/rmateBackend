const mongoose = require('mongoose');

const statementSchema = new mongoose.Schema({
  statementId: {
    type: String,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  }
}, { timestamps: true });


module.exports = mongoose.model('Statement', statementSchema);