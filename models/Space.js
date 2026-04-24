const mongoose = require('mongoose')

/**
 * Space Schema - Coworking spaces
 * @type {mongoose.Schema}
 */
const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { 
    type: String, 
    required: true, 
    index: true,
    unique: true,
    trim: true 
  },
  description: { type: String, required: true },
  area: { 
    type: String, 
    enum: ['Panaji', 'Calangute', 'Vagator', 'Anjuna', 'Colva', 'Margao', 'Mapusa', 'Candolim', 'Arambol'],
    required: true 
  },
  address: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  wifiSpeed: { type: Number, required: true }, // in Mbps
  wifiReliability: { 
    type: String, 
    enum: ['excellent', 'good', 'average', 'poor'] 
  },
  openHours: { type: String },
  pricing: {
    hourly: { type: Number, required: true },
    daily: { type: Number, required: true },
    monthly: { type: Number, required: true },
    currency: { 
      type: String, 
      default: 'INR' 
    }
  },
  powerOutlets: { type: Boolean, default: false },
  hasAC: { type: Boolean, default: false },
  hasStanding: { type: Boolean, default: false },
  hasCafe: { type: Boolean, default: false },
  noiseLevel: {
    type: String,
    enum: ['silent', 'quiet', 'moderate', 'buzzy']
  },
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
  collection: 'spaces',
  timestamps: true
})

// Indexes (slug is automatically indexed due to unique constraint)
SpaceSchema.index({ area: 1 })

// Text search index
SpaceSchema.index({ name: 'text', description: 'text', area: 'text' })

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.Space || mongoose.model('Space', SpaceSchema)
