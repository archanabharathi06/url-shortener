const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true
    },
    visitedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    device: {
      type: String,
      default: 'desktop'
    },
    browser: {
      type: String,
      default: 'unknown'
    },
    country: {
      type: String,
      default: 'unknown'
    },
    referer: {
      type: String,
      default: 'direct'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
visitSchema.index({ urlId: 1 });
visitSchema.index({ visitedAt: 1 });

module.exports = mongoose.model('Visit', visitSchema);
