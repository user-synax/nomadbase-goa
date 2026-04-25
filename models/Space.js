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
  speedTests: [{
    speed: { type: Number, required: true },
    reportedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    date: { type: Date, default: Date.now },
    comment: { type: String, maxlength: 500 }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'spaces',
  timestamps: true
})

// Pre-save hook to recalculate wifiSpeed from last 5 speed tests
SpaceSchema.pre('save', function(next) {
  if (this.speedTests && this.speedTests.length > 0) {
    const sortedTests = this.speedTests.sort((a, b) => b.date - a.date)
    const lastFive = sortedTests.slice(0, 5)
    const avg = lastFive.reduce((sum, test) => sum + test.speed, 0) / lastFive.length
    this.wifiSpeed = Math.round(avg)
  }
  next()
})

// Indexes (slug is automatically indexed due to unique constraint)
SpaceSchema.index({ area: 1 })

// Text search index
SpaceSchema.index({ name: 'text', description: 'text', area: 'text' })

// Apply .lean() reminder: Use .lean() for query results when you only need plain JavaScript objects

module.exports = mongoose.models.Space || mongoose.model('Space', SpaceSchema)
