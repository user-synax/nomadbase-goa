const mongoose = require('mongoose')

// Caching pattern: store connection in global._mongoose
let _mongoose = null

/**
 * Connects to MongoDB using Mongoose
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise<mongoose.Mongoose>} - The connected mongoose instance
 */
async function connect (uri = process.env.MONGODB_URI) {
  if (_mongoose) return _mongoose

  try {
    _mongoose = await mongoose.connect(uri)

    console.log('✅ MongoDB connected successfully')
    return _mongoose
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    throw error
  }
}

module.exports = connect
