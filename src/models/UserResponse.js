const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userResponseSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Store all responses in a flexible array
  responses: [responseSchema],
  // Automatically track completion based on required questions
  completed: {
    type: Boolean,
    default: false
  },
  // Store metadata for easy querying without hardcoding
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { 
  timestamps: true,
  // Allow dynamic fields for future expansion
  strict: false
});

// Index for efficient querying
userResponseSchema.index({ phoneNumber: 1 });
userResponseSchema.index({ 'responses.questionId': 1 });
userResponseSchema.index({ 'metadata.name': 1 });
userResponseSchema.index({ 'metadata.zipCode': 1 });

module.exports = mongoose.model('UserResponse', userResponseSchema); 