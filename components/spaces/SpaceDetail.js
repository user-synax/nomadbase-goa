"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SpeedBadge } from "@/components/shared/SpeedBadge";
import { SpeedTestsSection } from "@/components/shared/SpeedGauge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { 
  Star, 
  Clock, 
  Volume2, 
  IndianRupee, 
  MapPin, 
  Wind, 
  Coffee, 
  Lock, 
  Wifi, 
  Monitor, 
  Mic, 
  Utensils, 
  Car, 
  Shield, 
  ThumbsUp,
  CheckCircle,
  X
} from "lucide-react";

export default function SpaceDetail({ space, reviews }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [speedTests, setSpeedTests] = useState([]);

  useEffect(() => {
    // Check authentication status
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(session => {
        setIsAuthenticated(!!session?.user);
      })
      .catch(() => setIsAuthenticated(false));

    // Fetch speed tests
    fetch(`/api/spaces/${space.slug}/speedtest`)
      .then(res => res.json())
      .then(data => {
        if (data.speedTests) {
          setSpeedTests(data.speedTests);
        }
      })
      .catch(console.error);
  }, [space.slug]);

  const amenityIcons = {
    "AC": Wind,
    "Cafe": Coffee,
    "Locker": Lock,
    "WiFi": Wifi,
    "Monitor": Monitor,
    "Mic": Mic,
    "Food": Utensils,
    "Parking": Car,
    "Security": Shield,
  };

  const getAmenityIcon = (amenity) => {
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (amenity.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return CheckCircle;
  };

  const handleSubmitReview = async () => {
    // Submit review logic here
    setIsReviewDialogOpen(false);
    setReviewRating(0);
    setReviewText("");
  };

  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />

      {/* IMAGE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {space.images && space.images.length > 0 ? (
          <div className="space-y-4">
            {/* First image - large */}
            <div 
              className="relative w-full h-[400px] md:h-[500px] rounded-[8px] overflow-hidden cursor-pointer border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
              onClick={() => setSelectedImage(space.images[0])}
            >
              <img 
                src={space.images[0]} 
                alt={`${space.name} - Main image`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Remaining images - 4-col grid */}
            {space.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {space.images.slice(1).map((image, index) => (
                  <div 
                    key={index}
                    className="relative h-32 md:h-40 rounded-[8px] overflow-hidden cursor-pointer border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${space.name} - Image ${index + 2}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[400px] rounded-[8px] border border-[#2e2e2e] flex items-center justify-center bg-[#0f0f0f]">
            <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {space.name}
            </p>
          </div>
        )}
      </section>

      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Space details */}
          <div className="flex-1">
            <h1 className="text-[48px] leading-[1.1] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {space.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Area badge - linked to area guide */}
              <Link
                href={`/areas/${space.area.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1 rounded-full text-sm font-medium bg-[#3ecf8e]/10 border border-[#3ecf8e] text-[#3ecf8e] hover:bg-[#3ecf8e]/20 transition-colors"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                {space.area}
              </Link>
              
              {/* Verified badge */}
              {space.verified && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-[#3ecf8e]/10 border border-[#3ecf8e] text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  <CheckCircle size={14} />
                  Verified
                </span>
              )}
            </div>

            {/* Rating display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < Math.floor(space.rating) ? "fill-[#3ecf8e] text-[#3ecf8e]" : "text-[#2e2e2e]"} 
                  />
                ))}
              </div>
              <span className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {space.rating}
              </span>
              <span className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                ({reviews.length} reviews)
              </span>
            </div>
          </div>

          {/* Right: Add Review button */}
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa]">
              <DialogHeader>
                <DialogTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Add a Review
                </DialogTitle>
              </DialogHeader>
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* Rating selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setReviewRating(rating)}
                          className="p-2 rounded-lg border border-[#2e2e2e] hover:border-[#3ecf8e] transition-colors"
                        >
                          <Star 
                            size={24} 
                            className={rating <= reviewRating ? "fill-[#3ecf8e] text-[#3ecf8e]" : "text-[#2e2e2e]"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review textarea */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full h-32 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors resize-none"
                      style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                    />
                  </div>

                  <Button 
                    onClick={handleSubmitReview}
                    className="w-full text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full"
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  >
                    Submit Review
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#898989] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    Sign in to leave a review
                  </p>
                  <Link href="/signin">
                    <Button className="text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* INFO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hours */}
          <div className="p-4 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-[#3ecf8e]" />
              <span className="text-sm font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Hours
              </span>
            </div>
            <p className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {space.openHours || "9:00 AM - 9:00 PM"}
            </p>
          </div>

          {/* Noise Level */}
          <div className="p-4 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={18} className="text-[#3ecf8e]" />
              <span className="text-sm font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Noise Level
              </span>
            </div>
            <p className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {space.noiseLevel || "Moderate"}
            </p>
          </div>

          {/* Price */}
          <div className="p-4 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee size={18} className="text-[#3ecf8e]" />
              <span className="text-sm font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Price
              </span>
            </div>
            <p className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              ₹{space.price?.daily || 500}/day
              <span className="text-[#898989] mx-2">•</span>
              ₹{space.price?.monthly || 15000}/month
            </p>
          </div>
        </div>
      </section>

      {/* SPEED TESTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SpeedTestsSection
            spaceSlug={space.slug}
            wifiSpeed={space.wifiSpeed}
            speedTests={speedTests}
            isAuthenticated={isAuthenticated}
          />
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-[24px] leading-[1.33] font-normal mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
                WiFi Quality Matters
              </h3>
              <p className="text-[16px] leading-[1.50] text-[#b4b4b4] max-w-md" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                As a digital nomad, reliable internet is essential. These speed tests are reported by community members who&apos;ve worked from this space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          Amenities
        </h2>
        <div className="flex flex-wrap gap-3">
          {space.amenities && space.amenities.length > 0 ? (
            space.amenities.map((amenity, index) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  <Icon size={16} className="text-[#3ecf8e]" />
                  <span className="text-sm">{amenity}</span>
                </div>
              );
            })
          ) : (
            <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              No amenities listed
            </p>
          )}
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          About This Space
        </h2>
        <p className="text-[16px] leading-[1.50] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {space.description || "No description available."}
        </p>
      </section>

      {/* REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          Reviews
        </h2>
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="p-6 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#171717] border border-[#2e2e2e] flex items-center justify-center text-[#fafafa]">
                      {review.author?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {review.author} {review.countryFlag || "🇮🇳"}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < review.rating ? "fill-[#3ecf8e] text-[#3ecf8e]" : "text-[#2e2e2e]"} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                          {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[16px] leading-[1.50] text-[#b4b4b4] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  {review.body}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#898989] hover:text-[#3ecf8e]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  <ThumbsUp size={14} className="mr-2" />
                  Helpful ({review.helpful || 0})
                </Button>
              </div>
            ))
          ) : (
            <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          Location
        </h2>
        <div className="space-y-4">
          <p className="text-[16px] leading-[1.50] text-[#b4b4b4] flex items-center gap-2" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            <MapPin size={18} className="text-[#3ecf8e]" />
            {space.address ? (
              <>
                {space.address.split(space.area)[0]}
                <Link
                  href={`/areas/${space.area.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-[#00c573] hover:underline"
                >
                  {space.area}
                </Link>
                {space.address.split(space.area)[1]}
              </>
            ) : (
              <Link
                href={`/areas/${space.area.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[#00c573] hover:underline"
              >
                {space.area}
              </Link>
            )}
            , Goa
          </p>
          <div className="w-full h-[300px] rounded-[8px] overflow-hidden border border-[#2e2e2e]">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(space.area + ', Goa')}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-[#171717] border-[#2e2e2e] max-w-4xl p-0">
          <div className="relative w-full h-[600px]">
            <img 
              src={selectedImage} 
              alt="Full size image" 
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] hover:border-[#3ecf8e] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
