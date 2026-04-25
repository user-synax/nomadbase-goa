"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wifi, Upload, MessageSquare } from "lucide-react";
import Link from "next/link";

// SVG Arc Gauge Component
function ArcGauge({ speed, maxSpeed = 300 }) {
  const percentage = Math.min((speed / maxSpeed) * 100, 100);
  const circumference = 2 * Math.PI * 80; // radius = 80
  const strokeDashoffset = circumference - (percentage / 100) * (circumference * 0.75);

  // Calculate color based on speed
  let strokeColor = "#ef4444"; // red for slow
  if (speed >= 150) strokeColor = "#3ecf8e"; // green for excellent
  else if (speed >= 80) strokeColor = "#eab308"; // yellow for good

  return (
    <div className="relative w-48 h-36 mx-auto">
      <svg className="w-full h-full transform -rotate-[135deg]" viewBox="0 0 200 150">
        {/* Background arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#2e2e2e"
          strokeWidth="12"
          strokeDasharray={circumference * 0.75}
          strokeLinecap="round"
        />
        {/* Foreground arc - filled based on speed */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <Wifi size={24} className="text-[#3ecf8e] mb-1" />
        <span className="text-[32px] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {speed}
        </span>
        <span className="text-[12px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Mbps
        </span>
      </div>
    </div>
  );
}

// Speed Test Report Form Component
function SpeedTestForm({ spaceSlug, onSuccess, isAuthenticated }) {
  const [speed, setSpeed] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/spaces/${spaceSlug}/speedtest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speed: parseFloat(speed),
          date,
          comment
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit speed test");
      }

      const data = await response.json();
      onSuccess(data);
      setSpeed("");
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-[#898989] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Sign in to report WiFi speed
        </p>
        <Link href="/signin">
          <Button className="text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-500 text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Measured Speed (Mbps)
        </label>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder="e.g., 150"
          min="1"
          max="1000"
          required
          className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Date Tested
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] focus:border-[#3ecf8e] outline-none transition-colors"
          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the connection? Any issues?"
          maxLength={500}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors resize-none"
          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full disabled:opacity-50"
        style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
      >
        <Upload size={16} className="mr-2" />
        {isSubmitting ? "Submitting..." : "Submit Speed Test"}
      </Button>
    </form>
  );
}

// Main Speed Tests Section Component
export function SpeedTestsSection({ spaceSlug, wifiSpeed = 0, speedTests = [], isAuthenticated = false }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tests, setTests] = useState(speedTests);
  const [currentSpeed, setCurrentSpeed] = useState(wifiSpeed);

  const handleSuccess = (data) => {
    setCurrentSpeed(data.wifiSpeed);
    setIsDialogOpen(false);
    // Refresh speed tests
    fetch(`/api/spaces/${spaceSlug}/speedtest`)
      .then(res => res.json())
      .then(data => {
        if (data.speedTests) {
          setTests(data.speedTests);
        }
      });
  };

  // Get reliability label based on speed
  const getReliabilityLabel = (speed) => {
    if (speed >= 150) return "Excellent — 4K streaming, video calls, large uploads";
    if (speed >= 80) return "Good — HD video calls, normal browsing";
    if (speed >= 40) return "Fair — Basic browsing, occasional calls";
    return "Slow — Limited productivity";
  };

  return (
    <div className="p-6 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
      <h3 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
        Speed Tests
      </h3>

      {/* Speed Gauge */}
      <ArcGauge speed={currentSpeed} />

      {/* Reliability Info */}
      <div className="text-center mt-4 mb-6">
        <p className="text-[14px] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {getReliabilityLabel(currentSpeed)}
        </p>
        <p className="text-[12px] text-[#898989] mt-1" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Community verified
        </p>
      </div>

      {/* Recent Tests */}
      {tests.length > 0 && (
        <div className="border-t border-[#2e2e2e] pt-4 mt-4">
          <h4 className="text-[14px] font-medium text-[#898989] mb-3" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Recent Reports
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {tests.slice(0, 5).map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-[6px] bg-[#171717] border border-[#2e2e2e]">
                <div className="flex items-center gap-3">
                  <Wifi size={16} className="text-[#3ecf8e]" />
                  <span className="text-[#fafafa] font-medium" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {test.speed} Mbps
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[12px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {formatDistanceToNow(new Date(test.date), { addSuffix: true })}
                  </span>
                  {test.comment && (
                    <p className="text-[12px] text-[#b4b4b4] flex items-center gap-1 mt-0.5">
                      <MessageSquare size={10} />
                      {test.comment.slice(0, 30)}{test.comment.length > 30 ? "..." : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full mt-4 text-[#3ecf8e] border-[#3ecf8e] hover:bg-[#3ecf8e]/10 rounded-full"
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            <Upload size={16} className="mr-2" />
            Report WiFi Speed
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa]">
          <DialogHeader>
            <DialogTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Report WiFi Speed
            </DialogTitle>
          </DialogHeader>
          <SpeedTestForm
            spaceSlug={spaceSlug}
            onSuccess={handleSuccess}
            isAuthenticated={isAuthenticated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
