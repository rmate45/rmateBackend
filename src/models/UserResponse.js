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

const retirementPlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    default: 'Plan1'
  },
  htmlContent: String,
  generatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'generated', 'failed'],
    default: 'pending'
  }
}, { _id: false });

const userResponseSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  responses: [responseSchema],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  retirementPlans: [retirementPlanSchema],
  completed: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  strict: false
});

userResponseSchema.index({ phoneNumber: 1 });
userResponseSchema.index({ 'metadata.name': 1 });

module.exports = mongoose.model('UserResponse', userResponseSchema);