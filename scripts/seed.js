const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('../models/User')
const Space = require('../models/Space')
const Coliving = require('../models/Coliving')
const Thread = require('../models/Thread')

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

/**
 * Generate slug from name (kebab-case)
 * @param {string} name - The name to convert to slug
 * @returns {string} - kebab-case slug
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Main seed function
 */
async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Drop existing data
    await User.deleteMany({})
    await Space.deleteMany({})
    await Coliving.deleteMany({})
    await Thread.deleteMany({})
    console.log('🗑️  Dropped existing data')

    // Create a dummy user for addedBy references
    const dummyUser = new User({
      name: 'Seed User',
      email: 'seed@nomadbase.goa',
      role: 'admin',
    })
    await dummyUser.save()
    console.log('👤 Created dummy user')

    // CO-WORKING SPACES
    const spaces = [
      {
        name: 'Deskbee Cowork',
        area: 'Panaji',
        description: 'A modern coworking space in the heart of Panaji with high-speed internet and ergonomic furniture.',
        address: '123 Main Street, Panaji, Goa',
        wifiSpeed: 200,
        daily: 499,
        monthly: 7999,
        amenities: ['AC', 'Standing Desks', 'Locker', 'Cafe', 'Meeting Room', 'Printer'],
        verified: true,
        noiseLevel: 'quiet',
      },
      {
        name: 'The Hive',
        area: 'Vagator',
        description: 'A vibrant coworking space with stunning beach views, perfect for digital nomads.',
        address: 'Beach Road, Vagator, Goa',
        wifiSpeed: 150,
        daily: 400,
        monthly: 6500,
        amenities: ['AC', 'Beach View', 'Cafe', 'Lounge'],
        verified: true,
        noiseLevel: 'moderate',
      },
      {
        name: 'Cowo Goa',
        area: 'Calangute',
        description: 'A popular coworking spot in Calangute with pool access and a relaxed atmosphere.',
        address: 'Calangute Beach Road, Goa',
        wifiSpeed: 100,
        daily: 350,
        monthly: 5500,
        amenities: ['AC', 'Pool Access', 'Cafe'],
        verified: true,
        noiseLevel: 'quiet',
      },
      {
        name: 'Workabout',
        area: 'Anjuna',
        description: 'A creative coworking space in Anjuna with outdoor seating and a laid-back vibe.',
        address: 'Anjuna Beach Road, Goa',
        wifiSpeed: 80,
        daily: 300,
        monthly: 5000,
        amenities: ['Outdoor Seating', 'Cafe', 'Hammocks'],
        verified: false,
        noiseLevel: 'buzzy',
      },
      {
        name: 'Nomad House',
        area: 'Panaji',
        description: 'Premium coworking space with private pods and 24/7 access for serious digital nomads.',
        address: 'Patto Plaza, Panaji, Goa',
        wifiSpeed: 300,
        daily: 599,
        monthly: 9999,
        amenities: ['AC', 'Private Pods', '24/7 Access', 'Shower', 'Locker'],
        verified: true,
        noiseLevel: 'silent',
      },
      {
        name: 'Space Between',
        area: 'Margao',
        description: 'A cozy coworking space in Margao with reliable WiFi and a quiet environment.',
        address: 'Margao Main Market, Goa',
        wifiSpeed: 120,
        daily: 250,
        monthly: 4000,
        amenities: ['AC', 'Cafe'],
        verified: false,
        noiseLevel: 'quiet',
      },
      {
        name: 'Bamboo Work',
        area: 'Arambol',
        description: 'An open-air coworking space in Arambol with a beachy vibe and slow pace.',
        address: 'Arambol Beach, Goa',
        wifiSpeed: 60,
        daily: 200,
        monthly: 3500,
        amenities: ['Beach Walk', 'Open Air', 'Hammocks'],
        verified: false,
        noiseLevel: 'moderate',
      },
      {
        name: 'The Grid',
        area: 'Candolim',
        description: 'A modern coworking space in Candolim with high-speed internet and 24/7 access.',
        address: 'Candolim Beach Road, Goa',
        wifiSpeed: 250,
        daily: 450,
        monthly: 7000,
        amenities: ['AC', 'Standing Desks', '24/7 Access', 'Locker', 'Cafe'],
        verified: true,
        noiseLevel: 'quiet',
      },
    ]

    const spaceDocs = spaces.map(space => {
      const hasStanding = space.amenities.includes('Standing Desks')
      const hasAC = space.amenities.includes('AC')
      const hasCafe = space.amenities.includes('Cafe')
      
      return {
        ...space,
        slug: generateSlug(space.name),
        pricing: {
          hourly: Math.round(space.monthly / 22 / 8), // approximate hourly from monthly
          daily: space.daily,
          monthly: space.monthly,
          currency: 'INR',
        },
        openHours: space.verified ? '9am - 10pm' : '10am - 7pm',
        powerOutlets: true,
        hasAC: hasAC,
        hasStanding: hasStanding,
        hasCafe: hasCafe,
        rating: 0,
        reviewCount: 0,
        addedBy: dummyUser._id,
      }
    })

    await Space.insertMany(spaceDocs)
    console.log(`🏢 Created ${spaceDocs.length} co-working spaces`)

    // COLIVINGS
    const colivings = [
      {
        name: 'NomadVilla Goa',
        area: 'Vagator',
        description: 'A luxury coliving space in Vagator with private rooms and a vibrant community.',
        address: 'Vagator Beach Road, Goa',
        monthly: 25000,
        includes: ['WiFi', 'AC', 'Breakfast', 'Pool', 'Cleaning'],
        minStay: 7,
      },
      {
        name: 'The Tribe House',
        area: 'Anjuna',
        description: 'A welcoming coliving house in Anjuna with community events and shared dinners.',
        address: 'Anjuna Market Road, Goa',
        monthly: 18000,
        includes: ['WiFi', 'AC', 'Community Dinners'],
        minStay: 14,
      },
      {
        name: 'Casa Remote',
        area: 'Panaji',
        description: 'A modern coliving space in Panaji with comfortable rooms and daily breakfast.',
        address: 'Fontainhas, Panaji, Goa',
        monthly: 22000,
        includes: ['WiFi', 'AC', 'Breakfast', 'Laundry'],
        minStay: 7,
      },
      {
        name: 'Surf & Work',
        area: 'Colva',
        description: 'A unique coliving experience in Colva combining surfing with remote work.',
        address: 'Colva Beach Road, Goa',
        monthly: 15000,
        includes: ['WiFi', 'Surf Lessons', 'Breakfast'],
        minStay: 7,
      },
      {
        name: 'Goa Digital Den',
        area: 'Calangute',
        description: 'A premium coliving space in Calangute with dedicated workstations and airport transfers.',
        address: 'Baga Road, Calangute, Goa',
        monthly: 20000,
        includes: ['WiFi', 'AC', 'Co-working desk included', 'Airport pickup'],
        minStay: 30,
      },
    ]

    const colivingDocs = colivings.map(coliving => ({
        ...coliving,
        slug: generateSlug(coliving.name),
        pricing: {
          monthly: coliving.monthly,
          weekly: Math.round(coliving.monthly / 4),
          currency: 'INR',
        },
        roomTypes: [
          { type: 'Shared Dorm', price: Math.round(coliving.monthly * 0.6), available: 4 },
          { type: 'Private Room', price: coliving.monthly, available: 2 },
          { type: 'Private Suite', price: coliving.monthly * 1.5, available: 1 },
        ],
        rating: 0,
        reviewCount: 0,
        verified: true,
        addedBy: dummyUser._id,
      }))

    await Coliving.insertMany(colivingDocs)
    console.log(`🏠 Created ${colivingDocs.length} colivings`)

    // COMMUNITY THREADS
    const threads = [
      {
        title: 'Best SIM card for data in Goa 2025?',
        body: 'Planning my trip to Goa and wondering which SIM card offers the best data packages. Any recommendations for 4G/5G coverage in North Goa?',
        tags: ['connectivity', 'tips'],
      },
      {
        title: 'Is it safe to leave laptop in colivings?',
        body: "I'm considering a coliving space but want to know if it's generally safe to leave my laptop and other equipment there while exploring. Any experiences?",
        tags: ['safety', 'coliving'],
      },
      {
        title: 'Monthly budget breakdown — living in Vagator',
        body: 'Can anyone share their typical monthly expenses for living in Vagator? Looking for accommodation, coworking, food, and leisure costs.',
        tags: ['budget', 'vagator'],
      },
      {
        title: 'BSNL vs Airtel vs Jio — real speed tests from Anjuna',
        body: 'I\'ve been testing different providers in Anjuna and wanted to share some speed test results. BSNL seems surprisingly good in some areas!',
        tags: ['connectivity', 'wifi'],
      },
      {
        title: 'Anyone going to Goa in June? Let\'s cowork together',
        body: 'Heading to Goa in June and would love to meet other digital nomads for coworking sessions. Anyone around?',
        tags: ['meetup', 'coliving'],
      },
    ]

    const threadDocs = threads.map(thread => ({
      ...thread,
      slug: generateSlug(thread.title),
      upvotes: [],
      views: 0,
      replyCount: 0,
      pinned: false,
      author: dummyUser._id,
    }))

    await Thread.insertMany(threadDocs)
    console.log(`🧵 Created ${threadDocs.length} community threads`)

    console.log('\n🎉 Seed complete ✓')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
