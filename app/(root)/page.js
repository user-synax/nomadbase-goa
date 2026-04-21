"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { SpaceCard } from "@/components/spaces/SpaceCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { HeroSection, LogosSection } from "@/components/ui/hero-1"
import HeroText from "@/components/ui/hero-shutter-text"
import { StepCard } from "@/components/ui/step-card"

// Component for fetching spaces
function FeaturedSpaces() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/spaces?limit=3`, {
          cache: 'no-store'
        })
        const data = await res.json()
        setSpaces(data)
      } catch (error) {
        console.error("Error fetching spaces:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSpaces()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video bg-[#242424]" />
            <Skeleton className="h-6 w-3/4 bg-[#242424]" />
            <Skeleton className="h-4 w-1/2 bg-[#242424]" />
            <Skeleton className="h-4 w-full bg-[#242424]" />
          </div>
        ))}
      </div>
    )
  }

  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "#898989" }}>
        <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>Unable to load spaces at this time.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {spaces.map((space) => (
        <SpaceCard key={space._id} space={space} />
      ))}
    </div>
  )
}

// Component for fetching community threads
function CommunityThreads() {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/community?limit=3`, {
          cache: 'no-store'
        })
        const data = await res.json()
        setThreads(data)
      } catch (error) {
        console.error("Error fetching threads:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchThreads()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 space-y-3 bg-[#171717] border border-[#2e2e2e] rounded-[8px]">
            <Skeleton className="h-6 w-3/4 bg-[#242424]" />
            <Skeleton className="h-4 w-full bg-[#242424]" />
            <Skeleton className="h-4 w-2/3 bg-[#242424]" />
          </div>
        ))}
      </div>
    )
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>Unable to load community threads at this time.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Link 
          key={thread._id} 
          href={`/community/${thread._id}`}
          className="block p-4 rounded-[8px] cursor-pointer bg-[#171717] border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
        >
          <h4 className="text-[16px] leading-[1.43] font-normal mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {thread.title}
          </h4>
          <p className="text-[14px] leading-[1.43] font-normal text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {thread.content}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [animationComplete, setAnimationComplete] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />
      
      {/* HERO TEXT ANIMATION - Full screen on load */}
      <HeroText text="NOMADBASE" onAnimationComplete={() => setAnimationComplete(true)} />

      {/* Main Content - Shows after animation completes */}
      <div className={`transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* HERO SECTION */}
      <HeroSection />
      <LogosSection />

      {/* HOW IT WORKS */}
      <section className="py-[128px] bg-[#0f0f0f]" style={{ borderTop: "1px solid #242424" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-[36px] leading-[1.25] font-normal mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              How It Works
            </h2>
            <p className="text-[16px] leading-[1.50] font-normal text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Three simple steps to your perfect workspace
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Find Your Space",
                description: "Browse verified co-working spaces and colivings across Goa with real reviews and detailed amenities.",
              },
              {
                title: "Connect With Nomads",
                description: "Join our community of remote workers, share experiences, and make lasting connections.",
              },
              {
                title: "Ask the AI",
                description: "Get personalized recommendations from our AI assistant trained on Goa's nomad scene.",
              },
            ].map((step, index) => (
              <StepCard
                key={index}
                title={step.title}
                description={step.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SPACES */}
      <section className="py-[128px] bg-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-[36px] leading-[1.25] font-normal mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Featured Spaces
            </h2>
            <p className="text-[16px] leading-[1.50] font-normal text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Top-rated co-working spaces loved by nomads
            </p>
          </motion.div>

          <FeaturedSpaces />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/spaces"
              className="inline-block text-[14px] leading-[1.43] font-medium transition-colors text-[#00c573]"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              View All Spaces <ChevronRight size={14} className="inline ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI ASSISTANT TEASER */}
      <section className="py-[128px] bg-[#0f0f0f]" style={{ borderTop: "1px solid #242424" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-[36px] leading-[1.25] font-normal mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Not sure where to start?
              </h2>
              <p className="text-[16px] leading-[1.50] font-normal mb-6 text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Our AI nomad assistant knows every corner of Goa. Tell it your budget, preferences, and stay duration — get personalized recommendations for spaces, areas, and communities that fit your lifestyle.
              </p>
              <Link
                href="/assistant"
                className="inline-block px-8 py-2 text-[14px] leading-[1.14] font-medium transition-colors text-[#fafafa] border border-[#fafafa] rounded-[9999px]"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", backgroundColor: "#0f0f0f" }}
              >
                Try the Assistant <ChevronRight size={14} className="inline ml-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-[8px] bg-[#171717] border border-[#2e2e2e]"
            >
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-4 rounded-lg bg-[#3ecf8e]">
                    <p className="text-sm text-[#fafafa]">
                      I'm staying 6 weeks, budget ₹30k/month. Best area?
                    </p>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-lg bg-[#242424]">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-[#3ecf8e]">
                        AI Assistant
                      </span>
                    </div>
                    <p className="text-sm text-[#fafafa]">
                      For 6 weeks on ₹30k, Vagator gives you the best balance of cafes, community, and coliving options. The Tribe House and NomadNest are great matches.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="py-[128px] bg-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-[36px] leading-[1.25] font-normal mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Ask. Share. Connect.
            </h2>
            <p className="text-[16px] leading-[1.50] font-normal text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Join conversations with fellow nomads
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-12">
            <CommunityThreads />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link
              href="/community"
              className="inline-block text-[14px] leading-[1.43] font-medium transition-colors text-[#00c573]"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              Join the Community <ChevronRight size={14} className="inline ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
      </div>
    </div>
  )
}
