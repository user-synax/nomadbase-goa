const mongoose = require('mongoose')

/**
 * User Schema
 * @type {mongoose.Schema}
 */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  avatar: { type: String },
  bio: { type: String },
  country: { type: String },
  currentLocation: { type: String },
  nomadSince: { type: Date },
  skills: [{ type: String }],
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  twitterUrl: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'users',
  timestamps: true
})

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
