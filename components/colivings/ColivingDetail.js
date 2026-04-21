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
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { 
  Star, 
  IndianRupee, 
  MapPin, 
  CheckCircle,
  X,
  Coffee,
  Utensils,
  Car,
  Wifi,
  Wind,
  Lock,
  Shield,
  ThumbsUp
} from "lucide-react";

export function ColivingDetail({ coliving, reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEnquireDialogOpen, setIsEnquireDialogOpen] = useState(false);
  const [enquireForm, setEnquireForm] = useState({
    name: "",
    email: "",
    message: "",
    dates: ""
  });
  const [showToast, setShowToast] = useState(false);

  const handleEnquireSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsEnquireDialogOpen(false);
    setEnquireForm({ name: "", email: "", message: "", dates: "" });
  };

  const amenityIcons = {
    "WiFi": Wifi,
    "AC": Wind,
    "Breakfast": Coffee,
    "Pool": Shield,
    "Kitchen": Utensils,
    "Laundry": Lock,
    "Parking": Car,
  };

  const getAmenityIcon = (amenity) => {
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (amenity.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return CheckCircle;
  };

  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />

      {/* IMAGE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {coliving.images && coliving.images.length > 0 ? (
          <div className="space-y-4">
            {/* First image - large */}
            <div 
              className="relative w-full h-[400px] md:h-[500px] rounded-[8px] overflow-hidden cursor-pointer border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
              onClick={() => setSelectedImage(coliving.images[0])}
            >
              <img 
                src={coliving.images[0]} 
                alt={`${coliving.name} - Main image`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Remaining images - 4-col grid */}
            {coliving.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coliving.images.slice(1).map((image, index) => (
                  <div 
                    key={index}
                    className="relative h-32 md:h-40 rounded-[8px] overflow-hidden cursor-pointer border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${coliving.name} - Image ${index + 2}`} 
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
              {coliving.name}
            </p>
          </div>
        )}
      </section>

      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Coliving details */}
          <div className="flex-1">
            <h1 className="text-[48px] leading-[1.1] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {coliving.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Area badge */}
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#3ecf8e]/10 border border-[#3ecf8e] text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {coliving.area}
              </span>
              
              {/* Min Stay badge */}
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#0f0f0f] border border-[#2e2e2e] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Min {coliving.minStay || 7} days
              </span>
              
              {/* Verified badge */}
              {coliving.verified && (
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
                    className={i < Math.floor(coliving.rating) ? "fill-[#3ecf8e] text-[#3ecf8e]" : "text-[#2e2e2e]"} 
                  />
                ))}
              </div>
              <span className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {coliving.rating}
              </span>
              <span className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                ({reviews.length} reviews)
              </span>
            </div>
          </div>

          {/* Right: Enquire button */}
          <Dialog open={isEnquireDialogOpen} onOpenChange={setIsEnquireDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Enquire
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa]">
              <DialogHeader>
                <DialogTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Enquire About {coliving.name}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEnquireSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={enquireForm.name}
                    onChange={(e) => setEnquireForm({ ...enquireForm, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={enquireForm.email}
                    onChange={(e) => setEnquireForm({ ...enquireForm, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    Preferred Dates
                  </label>
                  <input
                    type="text"
                    value={enquireForm.dates}
                    onChange={(e) => setEnquireForm({ ...enquireForm, dates: e.target.value })}
                    placeholder="e.g., Jan 15 - Feb 28"
                    className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    Message
                  </label>
                  <textarea
                    value={enquireForm.message}
                    onChange={(e) => setEnquireForm({ ...enquireForm, message: e.target.value })}
                    placeholder="Tell us about your requirements..."
                    required
                    className="w-full h-32 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors resize-none"
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Send Enquiry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* ROOM TYPES TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          Room Types
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#242424]">
                <th className="text-left py-3 px-4 text-[14px] font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Type
                </th>
                <th className="text-left py-3 px-4 text-[14px] font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Price (Monthly)
                </th>
                <th className="text-left py-3 px-4 text-[14px] font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Availability
                </th>
              </tr>
            </thead>
            <tbody>
              {coliving.roomTypes && coliving.roomTypes.length > 0 ? (
                coliving.roomTypes.map((room, index) => (
                  <tr key={index} className="border-b border-[#242424]">
                    <td className="py-4 px-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      {room.type}
                    </td>
                    <td className="py-4 px-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      ₹{room.price}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.available ? "bg-[#3ecf8e]/10 border border-[#3ecf8e] text-[#3ecf8e]" : "bg-red-500/10 border border-red-500 text-red-500"}`} style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {room.available ? "Available" : "Full"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    No room types available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* INCLUDES LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          Includes
        </h2>
        <div className="flex flex-wrap gap-3">
          {coliving.includes && coliving.includes.length > 0 ? (
            coliving.includes.map((item, index) => {
              const Icon = getAmenityIcon(item);
              return (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  <Icon size={16} className="text-[#3ecf8e]" />
                  <span className="text-sm">{item}</span>
                </div>
              );
            })
          ) : (
            <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              No includes listed
            </p>
          )}
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          About This Coliving
        </h2>
        <p className="text-[16px] leading-[1.50] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {coliving.description || "No description available."}
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
            {coliving.address || `${coliving.area}, Goa`}
          </p>
          <div className="w-full h-[300px] rounded-[8px] overflow-hidden border border-[#2e2e2e]">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(coliving.area + ', Goa')}`}
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 px-6 py-3 rounded-lg bg-[#3ecf8e] text-[#0f0f0f] font-medium z-50" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Message sent! They'll contact you soon.
        </div>
      )}
    </div>
  );
}
