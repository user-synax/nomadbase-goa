"use client";

import ChatInterface from "@/components/assistant/ChatInterface";

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-[#2e2e2e]">
        <div>
          <h1 className="text-[20px] leading-[1.25] font-normal text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            NomadBase AI
          </h1>
          <p className="text-[12px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Powered by Groq
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)] md:h-screen">
        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
