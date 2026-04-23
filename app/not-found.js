import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <Compass className="w-24 h-24 text-[#3ecf8e] mx-auto mb-6" />
        <h1 className="text-[72px] font-normal text-[#fafafa] mb-4 leading-none" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Lost in Goa?
        </h1>
        <p className="text-[18px] text-[#b4b4b4] mb-8" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          You took a wrong turn somewhere between the beach and the bhaji. 
          Let's get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-[#0f0f0f] rounded-[9999px] text-[14px] font-medium transition-colors"
          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}