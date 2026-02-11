const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  transcript: {
    type: String,
    required: true
  },
  englishText: {
    type: String,
    required: true
  },
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1
    },
    mood: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    },
    keywords: [String]
  },
  earnings: {
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    weather: String,
    traffic: String,
    temperature: Number,
    location: String
  },
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
dailyLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
