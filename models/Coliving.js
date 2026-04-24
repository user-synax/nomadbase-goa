const mongoose = require('mongoose')

/**
 * Coliving Schema
 * @type {mongoose.Schema}
 */
const ColivingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { 
    type: String, 
    required: true, 
    index: true,
    unique: true,
    trim: true 
  },
  description: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  pricing: {
    monthly: { type: Number, required: true },
    weekly: { type: Number, required: true },
    currency: { 
      type: String, 
      default: 'INR' 
    }
  },
  roomTypes: [{
    type: { type: String },
    price: { type: Number },
    available: { type: Number }
  }],
  includes: [{ type: String }],
  minStay: { type: Number, required: true }, // in days
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'colivings',
  timestamps: true
})

// Indexes
ColivingSchema.index({ area: 1 })

// Text search index
ColivingSchema.index({ name: 'text', description: 'text', area: 'text' })

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.Coliving || mongoose.model('Coliving', ColivingSchema)
