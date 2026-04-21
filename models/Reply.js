const mongoose = require('mongoose')

/**
 * Reply Schema
 * @type {mongoose.Schema}
 */
const ReplySchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  thread: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Thread', 
    required: true 
  },
  body: { type: String, required: true },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'replies',
  timestamps: true
})

// Index on thread for efficient querying
ReplySchema.index({ thread: 1 })

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.Reply || mongoose.model('Reply', ReplySchema)
