"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter, X, Check } from "lucide-react"

const AREAS = ["Panaji", "Vagator", "Anjuna", "Calangute", "Candolim", "Margao", "Colva", "Arambol"]
const WIFI_SPEEDS = ["50+", "80+", "100+", "150+", "200+"]
const NOISE_LEVELS = ["Any", "Silent", "Quiet", "Moderate", "Buzzy"]
const AMENITIES = ["AC", "Standing Desks", "24/7 Access", "Cafe", "Locker", "Meeting Room", "Pool"]

export function SpaceFilters({ filters, onFilterChange, onApply, onClear, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleArea = (area) => {
    const newAreas = filters.areas.includes(area)
      ? filters.areas.filter((a) => a !== area)
      : [...filters.areas, area]
    onFilterChange({ ...filters, areas: newAreas })
  }

  const toggleAmenity = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    onFilterChange({ ...filters, amenities: newAmenities })
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Area Filter */}
      <div>
        <h4 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Area
        </h4>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => toggleArea(area)}
              className="px-3 py-1.5 text-sm rounded-full transition-all"
              style={{
                backgroundColor: filters.areas.includes(area) ? "#3ecf8e" : "#171717",
                border: filters.areas.includes(area) ? "1px solid #3ecf8e" : "1px solid #2e2e2e",
                color: filters.areas.includes(area) ? "#0f0f0f" : "#fafafa",
                fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif"
              }}
            >
              {filters.areas.includes(area) && (
                <Check size={12} className="inline mr-1" style={{ color: "#0f0f0f" }} />
              )}
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* WiFi Speed Filter */}
      <div>
        <h4 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Min WiFi Speed
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {WIFI_SPEEDS.map((speed) => (
            <button
              key={speed}
              onClick={() => onFilterChange({ ...filters, minWifi: speed })}
              className="px-3 py-2 text-sm rounded-lg transition-all text-center"
              style={{
                backgroundColor: filters.minWifi === speed ? "#3ecf8e" : "#171717",
                border: filters.minWifi === speed ? "1px solid #3ecf8e" : "1px solid #2e2e2e",
                color: filters.minWifi === speed ? "#0f0f0f" : "#fafafa",
                fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif"
              }}
            >
              {speed} Mbps
            </button>
          ))}
        </div>
      </div>

      {/* Noise Level Filter */}
      <div>
        <h4 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Noise Level
        </h4>
        <div className="flex flex-wrap gap-2">
          {NOISE_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => onFilterChange({ ...filters, noise: level })}
              className="px-3 py-1.5 text-sm rounded-full transition-all"
              style={{
                backgroundColor: filters.noise === level ? "#3ecf8e" : "#171717",
                border: filters.noise === level ? "1px solid #3ecf8e" : "1px solid #2e2e2e",
                color: filters.noise === level ? "#0f0f0f" : "#fafafa",
                fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif"
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h4 className="text-[14px] font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Amenities
        </h4>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className="px-3 py-1.5 text-sm rounded-full transition-all"
              style={{
                backgroundColor: filters.amenities.includes(amenity) ? "#3ecf8e" : "#171717",
                border: filters.amenities.includes(amenity) ? "1px solid #3ecf8e" : "1px solid #2e2e2e",
                color: filters.amenities.includes(amenity) ? "#0f0f0f" : "#fafafa",
                fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif"
              }}
            >
              {filters.amenities.includes(amenity) && (
                <Check size={12} className="inline mr-1" style={{ color: "#0f0f0f" }} />
              )}
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Only Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="text-[14px] font-medium text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Verified Only
        </h4>
        <button
          onClick={() => onFilterChange({ ...filters, verified: !filters.verified })}
          className="w-12 h-6 rounded-full relative transition-colors"
          style={{
            backgroundColor: filters.verified ? "#3ecf8e" : "#242424",
          }}
        >
          <span
            className="absolute top-1 w-4 h-4 rounded-full transition-transform"
            style={{
              backgroundColor: "#171717",
              left: filters.verified ? "28px" : "4px",
            }}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#242424]">
        <Button
          onClick={() => {
            onApply()
            if (isMobile) setIsOpen(false)
          }}
          className="flex-1 px-8 py-2 text-[14px] leading-[1.14] font-medium text-[#fafafa] border border-[#fafafa] rounded-[9999px]"
          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", backgroundColor: "#0f0f0f" }}
        >
          Apply Filters
        </Button>
        <Button
          onClick={() => {
            onClear()
            if (isMobile) setIsOpen(false)
          }}
          variant="ghost"
          className="flex-1 px-8 py-2 text-[14px] leading-[1.14] font-medium text-[#fafafa] border border-[#2e2e2e] rounded-[9999px]"
          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", backgroundColor: "#0f0f0f" }}
        >
          Clear
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="w-full mb-4 text-[#fafafa] border border-[#2e2e2e] rounded-[8px] bg-[#242424]">
            <Filter size={18} strokeWidth={2} className="mr-2" />
            Filters
            {(filters.areas.length > 0 || filters.minWifi || filters.noise !== "Any" || filters.amenities.length > 0 || filters.verified) && (
              <span className="ml-2 px-2 py-0.5 text-[12px] rounded-full bg-[#3ecf8e] text-[#0f0f0f]">
                Active
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] bg-[#171717] border-none" style={{ padding: "24px" }}>
          <div className="mt-8">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="p-6 rounded-[8px] bg-[#171717] border border-[#2e2e2e]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-medium text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Filters
        </h3>
        {(filters.areas.length > 0 || filters.minWifi || filters.noise !== "Any" || filters.amenities.length > 0 || filters.verified) && (
          <Button
            onClick={onClear}
            variant="ghost"
            size="icon-sm"
            style={{ color: "#898989" }}
          >
            <X size={16} strokeWidth={2} />
          </Button>
        )}
      </div>
      <FilterContent />
    </div>
  )
}
