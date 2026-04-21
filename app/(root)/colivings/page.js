"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ColivingCard } from "@/components/colivings/ColivingCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowRight, Filter } from "lucide-react"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"

function ColivingsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [colivings, setColivings] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState("best-rated")
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    areas: searchParams.get("areas")?.split(",") || [],
    maxPrice: searchParams.get("maxPrice") || "",
    minStay: searchParams.get("minStay") || "Any",
    includes: searchParams.get("includes")?.split(",") || [],
    verified: searchParams.get("verified") === "true",
  })

  const availableAreas = ["Anjuna", "Vagator", "Morjim", "Ashwem", "Arambol", "Mapusa", "Panaji"]
  const availableIncludes = ["WiFi", "AC", "Breakfast", "Pool", "Kitchen", "Gym", "Laundry", "Parking"]
  const minStayOptions = ["Any", "7 days", "14 days", "30 days"]

  // Fetch colivings
  useEffect(() => {
    async function fetchColivings() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.areas.length > 0) params.append("areas", filters.areas.join(","))
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
        if (filters.minStay !== "Any") params.append("minStay", filters.minStay)
        if (filters.includes.length > 0) params.append("includes", filters.includes.join(","))
        if (filters.verified) params.append("verified", "true")
        params.append("sortBy", sortBy)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/colivings?${params.toString()}`)
        const data = await res.json()
        setColivings(data.colivings || [])
        setTotalCount(data.total || 0)
      } catch (error) {
        console.error("Failed to fetch colivings:", error)
        setColivings([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchColivings()
  }, [filters, sortBy])

  // Update URL when filters change
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    if (newFilters.areas.length > 0) params.append("areas", newFilters.areas.join(","))
    if (newFilters.maxPrice) params.append("maxPrice", newFilters.maxPrice)
    if (newFilters.minStay !== "Any") params.append("minStay", newFilters.minStay)
    if (newFilters.includes.length > 0) params.append("includes", newFilters.includes.join(","))
    if (newFilters.verified) params.append("verified", "true")
    router.push(`/colivings?${params.toString()}`)
  }, [router])

  const handleClearFilters = () => {
    setFilters({
      areas: [],
      maxPrice: "",
      minStay: "Any",
      includes: [],
      verified: false,
    })
    router.push("/colivings")
  }

  const toggleFilter = (filterType, value) => {
    const currentFilters = filters[filterType]
    const newFilters = [...currentFilters]
    const index = newFilters.indexOf(value)
    
    if (index > -1) {
      newFilters.splice(index, 1)
    } else {
      newFilters.push(value)
    }
    
    updateFilters({ ...filters, [filterType]: newFilters })
  }

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#242424]">
        <Filter size={32} strokeWidth={2} className="text-[#898989]" />
      </div>
      <h3 className="text-[24px] leading-[1.33] font-normal mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
        No colivings match your filters
      </h3>
      <p className="text-[14px] mb-6 text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
        Try adjusting your filters or clear them to see all colivings.
      </p>
      <Button
        onClick={handleClearFilters}
        variant="ghost"
        className="px-8 py-2 text-[14px] leading-[1.14] font-medium text-[#fafafa] border border-[#fafafa] rounded-[9999px]"
        style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", backgroundColor: "#0f0f0f" }}
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[96px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[48px] leading-[1.1] font-normal mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Colivings
          </h1>
          <p className="text-[16px] leading-[1.50] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Find your perfect home away from home in Goa
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Clear Filters */}
              {(filters.areas.length > 0 || filters.maxPrice || filters.minStay !== "Any" || filters.includes.length > 0 || filters.verified) && (
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  className="w-full text-[#fafafa] border border-[#2e2e2e] rounded-[8px]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Clear All Filters
                </Button>
              )}

              {/* Areas */}
              <div>
                <h3 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Area
                </h3>
                <div className="space-y-2">
                  {availableAreas.map((area) => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.areas.includes(area)}
                        onChange={() => toggleFilter("areas", area)}
                        className="w-4 h-4 rounded border-[#2e2e2e] bg-[#0f0f0f] text-[#3ecf8e] focus:ring-[#3ecf8e]"
                      />
                      <span className="text-[14px] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {area}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <h3 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Max Monthly Price
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10000"
                    max="50000"
                    step="5000"
                    value={filters.maxPrice || 50000}
                    onChange={(e) => updateFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full accent-[#3ecf8e]"
                  />
                  <div className="flex justify-between text-xs text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    <span>₹10k</span>
                    <span>₹50k</span>
                  </div>
                  <p className="text-[14px] text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {filters.maxPrice ? `₹${parseInt(filters.maxPrice).toLocaleString()}` : "Any"}
                  </p>
                </div>
              </div>

              {/* Min Stay */}
              <div>
                <h3 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Minimum Stay
                </h3>
                <div className="space-y-2">
                  {minStayOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="minStay"
                        checked={filters.minStay === option}
                        onChange={() => updateFilters({ ...filters, minStay: option })}
                        className="w-4 h-4 border-[#2e2e2e] bg-[#0f0f0f] text-[#3ecf8e] focus:ring-[#3ecf8e]"
                      />
                      <span className="text-[14px] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Includes */}
              <div>
                <h3 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Includes
                </h3>
                <div className="space-y-2">
                  {availableIncludes.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.includes.includes(item)}
                        onChange={() => toggleFilter("includes", item)}
                        className="w-4 h-4 rounded border-[#2e2e2e] bg-[#0f0f0f] text-[#3ecf8e] focus:ring-[#3ecf8e]"
                      />
                      <span className="text-[14px] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => updateFilters({ ...filters, verified: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2e2e2e] bg-[#0f0f0f] text-[#3ecf8e] focus:ring-[#3ecf8e]"
                  />
                  <span className="text-[14px] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    Verified Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sort and Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[14px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {totalCount} coliving{totalCount !== 1 ? 's' : ''} found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] text-sm focus:border-[#3ecf8e] outline-none"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                <option value="best-rated">Best Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 rounded-[8px] bg-[#242424]" />
                    <Skeleton className="h-4 w-3/4 bg-[#242424]" />
                    <Skeleton className="h-4 w-1/2 bg-[#242424]" />
                  </div>
                ))}
              </div>
            ) : colivings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colivings.map((coliving) => (
                  <ColivingCard key={coliving._id} coliving={coliving} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ColivingsPageFallback() {
  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[96px]">
        <div className="mb-8">
          <Skeleton className="h-12 w-48 bg-[#242424]" />
          <Skeleton className="h-5 w-64 bg-[#242424]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 rounded-[8px] bg-[#242424]" />
              <Skeleton className="h-4 w-3/4 bg-[#242424]" />
              <Skeleton className="h-4 w-1/2 bg-[#242424]" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function ColivingsPage() {
  return (
    <Suspense fallback={<ColivingsPageFallback />}>
      <ColivingsPageContent />
    </Suspense>
  )
}
