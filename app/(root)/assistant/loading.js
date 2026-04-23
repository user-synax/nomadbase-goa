"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#3ecf8e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Loading assistant...
        </p>
      </div>
    </div>
  );
}