import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Wifi, Star, BadgeCheck, ChevronRight } from "lucide-react"

// Helper to convert area name to slug
function areaToSlug(area) {
  return area.toLowerCase().replace(/\s+/g, '-');
}

export function SpaceCard({ space }) {
  const router = useRouter()
  const getWifiBadge = (speed) => {
    if (speed >= 150) {
      return { color: "#3ecf8e", label: `${speed} Mbps` }
    } else if (speed >= 80) {
      return { color: "#3ecf8e", label: `${speed} Mbps` }
    } else {
      return { color: "#3ecf8e", label: `${speed} Mbps` }
    }
  }

  const wifiBadge = getWifiBadge(space.wifiSpeed || 0)

  return (
    <Link 
      href={`/spaces/${space.slug}`}
      className="block group bg-[#171717] rounded-[8px] border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors hover:transform-none"
    >
      {/* Image */}
      <div className="relative aspect-video rounded-t-[8px] overflow-hidden bg-[#242424]">
        {space.image ? (
          <Image
            src={space.image}
            alt={space.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#898989]">
              <span style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>No image</span>
          </div>
        )}
        {space.verified && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full bg-[rgba(62, 207, 142, 0.1)] border border-[rgba(62, 207, 142, 0.3)]">
            <BadgeCheck size={14} strokeWidth={2} className="text-[#3ecf8e]" />
            <span className="text-[12px] font-medium text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Name and Area */}
        <div className="flex items-start justify-between">
          <h3 className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            {space.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/areas/${areaToSlug(space.area)}`)
            }}
            className="px-2 py-1 text-[12px] rounded-full bg-[#242424] text-[#fafafa] hover:bg-[#3ecf8e]/20 hover:text-[#3ecf8e] transition-colors"
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            {space.area}
          </button>
        </div>

        {/* WiFi Badge */}
        <div className="flex items-center space-x-2">
          <Wifi size={16} strokeWidth={2} style={{ color: wifiBadge.color }} />
          <span className="text-[14px]" style={{ color: wifiBadge.color, fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {wifiBadge.label}
          </span>
        </div>

        {/* Amenities */}
        {space.amenities && space.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {space.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-[12px] rounded-full bg-[#242424] text-[#fafafa]"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Price and Rating */}
        <div className="flex items-center justify-between pt-4 border-t border-[#242424]">
          <div>
            <span className="text-[16px] font-medium text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              ₹{space.dailyPrice}
            </span>
            <span className="text-[14px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              /day
            </span>
          </div>
          <span className="text-[14px] font-medium transition-colors flex items-center text-[#00c573]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Details <ChevronRight size={14} className="ml-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}
