"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { SpaceCard } from "@/components/spaces/SpaceCard"
import { SpaceFilters } from "@/components/spaces/SpaceFilters"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowRight, Filter } from "lucide-react"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"

function SpacesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState("best-rated")
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    areas: searchParams.get("areas")?.split(",") || [],
    minWifi: searchParams.get("minWifi") || "",
    noise: searchParams.get("noise") || "Any",
    amenities: searchParams.get("amenities")?.split(",") || [],
    verified: searchParams.get("verified") === "true",
  })

  // Debounced filter update
  const debounce = useCallback((func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }, [])

  // Update URL params when filters change
  const updateURLParams = useCallback(
    debounce((newFilters) => {
      const params = new URLSearchParams()
      
      if (newFilters.areas.length > 0) {
        params.set("areas", newFilters.areas.join(","))
      }
      if (newFilters.minWifi) {
        params.set("minWifi", newFilters.minWifi)
      }
      if (newFilters.noise !== "Any") {
        params.set("noise", newFilters.noise)
      }
      if (newFilters.amenities.length > 0) {
        params.set("amenities", newFilters.amenities.join(","))
      }
      if (newFilters.verified) {
        params.set("verified", "true")
      }
      if (sortBy !== "best-rated") {
        params.set("sort", sortBy)
      }
      
      router.push(`/spaces?${params.toString()}`, { scroll: false })
    }, 300),
    [router, sortBy]
  )

  // Fetch spaces
  const fetchSpaces = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.areas.length > 0) {
        params.set("areas", filters.areas.join(","))
      }
      if (filters.minWifi) {
        params.set("minWifi", filters.minWifi)
      }
      if (filters.noise !== "Any") {
        params.set("noise", filters.noise)
      }
      if (filters.amenities.length > 0) {
        params.set("amenities", filters.amenities.join(","))
      }
      if (filters.verified) {
        params.set("verified", "true")
      }
      params.set("sort", sortBy)

      const res = await fetch(`/api/spaces?${params.toString()}`)
      const data = await res.json()
      
      setSpaces(data.spaces || [])
      setTotalCount(data.total || data.length || 0)
    } catch (error) {
      console.error("Error fetching spaces:", error)
      setSpaces([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy])

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    updateURLParams(newFilters)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    fetchSpaces()
  }

  // Handle clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      areas: [],
      minWifi: "",
      noise: "Any",
      amenities: [],
      verified: false,
    }
    setFilters(clearedFilters)
    updateURLParams(clearedFilters)
    fetchSpaces()
  }

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  // Fetch spaces on mount and when filters/sort change
  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-video rounded-[8px] bg-[#242424]" />
          <Skeleton className="h-6 w-3/4 bg-[#242424]" />
          <Skeleton className="h-4 w-1/2 bg-[#242424]" />
          <Skeleton className="h-4 w-full bg-[#242424]" />
          <Skeleton className="h-4 w-2/3 bg-[#242424]" />
        </div>
      ))}
    </div>
  )

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#242424]">
        <Filter size={32} strokeWidth={2} className="text-[#898989]" />
      </div>
      <h3 className="text-[24px] leading-[1.33] font-normal mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
        No spaces match your filters
      </h3>
      <p className="text-[14px] mb-6 text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
        Try adjusting your filters or clear them to see all spaces.
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
          <h1 className="text-[36px] leading-[1.25] font-normal mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Co-Working Spaces
          </h1>
          <p className="text-[16px] leading-[1.50] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Find your perfect workspace in Goa
          </p>
        </div>

        {/* Sort Dropdown (Top Right) */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-[14px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Showing {totalCount} {totalCount === 1 ? "space" : "spaces"}
          </p>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 text-[14px] rounded-lg cursor-pointer bg-[#242424] border border-[#2e2e2e] text-[#fafafa]"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              <option value="best-rated">Best Rated</option>
              <option value="fastest-wifi">Fastest WiFi</option>
              <option value="lowest-price">Lowest Price</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#898989] text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <SpaceFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isMobile={true}
            />
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <SpaceFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                isMobile={false}
              />
            </div>
          </div>

          {/* Spaces Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSkeleton />
            ) : spaces.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <SpaceCard key={space._id} space={space} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function SpacesPageFallback() {
  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[96px]">
        <div className="mb-8">
          <Skeleton className="h-12 w-48 bg-[#242424]" />
          <Skeleton className="h-5 w-64 bg-[#242424]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video rounded-[8px] bg-[#242424]" />
              <Skeleton className="h-6 w-3/4 bg-[#242424]" />
              <Skeleton className="h-4 w-1/2 bg-[#242424]" />
              <Skeleton className="h-4 w-full bg-[#242424]" />
              <Skeleton className="h-4 w-2/3 bg-[#242424]" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function SpacesPage() {
  return (
    <Suspense fallback={<SpacesPageFallback />}>
      <SpacesPageContent />
    </Suspense>
  )
}
