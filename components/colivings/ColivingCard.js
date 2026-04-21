import Link from "next/link";
import { Star, CheckCircle } from "lucide-react";

export function ColivingCard({ coliving }) {
  return (
    <Link 
      href={`/colivings/${coliving.slug}`}
      className="block group bg-[#171717] rounded-[8px] border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
    >
      {/* Image */}
      {coliving.images && coliving.images.length > 0 ? (
        <div className="relative h-48 rounded-t-[8px] overflow-hidden">
          <img 
            src={coliving.images[0]} 
            alt={coliving.name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 rounded-t-[8px] bg-[#0f0f0f] border-b border-[#2e2e2e] flex items-center justify-center">
          <span className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {coliving.name}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-[18px] leading-[1.33] font-normal mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {coliving.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#3ecf8e]/10 border border-[#3ecf8e] text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {coliving.area}
              </span>
              {coliving.verified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#3ecf8e]/10 border border-[#3ecf8e] text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  <CheckCircle size={12} />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            ₹{coliving.price?.monthly || "15,000"}
            <span className="text-[14px] text-[#898989]">/month</span>
          </p>
          {coliving.price?.weekly && (
            <p className="text-[14px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              ₹{coliving.price.weekly}/week
            </p>
          )}
        </div>

        {/* Top 3 includes */}
        {coliving.includes && coliving.includes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {coliving.includes.slice(0, 3).map((item, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 rounded text-xs bg-[#0f0f0f] border border-[#2e2e2e] text-[#b4b4b4]"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Min Stay */}
        <div className="mb-3">
          <span className="text-xs text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Min {coliving.minStay || 7} days
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(coliving.rating) ? "fill-[#3ecf8e] text-[#3ecf8e]" : "text-[#2e2e2e]"} 
              />
            ))}
          </div>
          <span className="text-[#fafafa] text-sm font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {coliving.rating}
          </span>
          <span className="text-[#898989] text-xs" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            ({coliving.reviewCount || 0} reviews)
          </span>
        </div>
      </div>
    </Link>
  );
}
