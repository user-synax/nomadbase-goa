const mongoose = require('mongoose')

/**
 * Review Schema
 * @type {mongoose.Schema}
 */
const ReviewSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  targetType: { 
    type: String, 
    enum: ['space', 'coliving'], 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  body: { 
    type: String, 
    required: true, 
    maxlength: 1000 
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'reviews',
  timestamps: true
})

// Compound index on targetId and targetType
ReviewSchema.index({ targetId: 1, targetType: 1 })

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
