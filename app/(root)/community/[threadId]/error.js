"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Community thread error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#171717] pt-16 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl text-[#fafafa] mb-2" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Something went wrong
        </h2>
        <p className="text-[#898989] mb-6" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          We couldn't load this thread. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.refresh()}
            className="bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-[#0f0f0f]"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/community")}
            className="border-[#2e2e2e] text-[#fafafa]"
          >
            Back to Community
          </Button>
        </div>
      </div>
    </div>
  );
}