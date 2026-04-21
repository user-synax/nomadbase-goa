const mongoose = require('mongoose')

/**
 * Thread Schema
 * @type {mongoose.Schema}
 */
const ThreadSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  slug: { 
    type: String, 
    required: true, 
    index: true,
    unique: true,
    trim: true 
  },
  body: { type: String, required: true },
  tags: [{ type: String }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'threads',
  timestamps: true
})

// Indexes
ThreadSchema.index({ createdAt: -1 })
ThreadSchema.index({ tags: 1 })

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema)
