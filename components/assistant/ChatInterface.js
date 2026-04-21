"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import gsap from "gsap";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: "init",
      role: "assistant",
      content: "Hey! 👋 I'm your Goa nomad guide. Ask me anything — budgets, areas, visa rules, coworking spots, you name it. What are you planning?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageRefs = useRef({});

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // GSAP animation for new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && messageRefs.current[lastMessage.id]) {
      gsap.fromTo(
        messageRefs.current[lastMessage.id],
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
      );
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async (text) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Add empty assistant message that will be filled by stream
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: err.message || "Something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        sendMessage(input);
      }
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Hey! 👋 I'm your Goa nomad guide. Ask me anything — budgets, areas, visa rules, coworking spots, you name it. What are you planning?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleQuickPrompt = (prompt) => {
    if (!isLoading) {
      sendMessage(prompt);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#2e2e2e]">
        <h2 className="text-[18px] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Chat
        </h2>
        <Button variant="ghost" size="icon-sm" onClick={clearChat} className="text-[#898989] hover:text-[#fafafa]">
          <X size={16} strokeWidth={2} />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            ref={(el) => (messageRefs.current[message.id] = el)}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[80%] md:max-w-[70%]">
              <div
                className={`px-5 py-3 ${
                  message.role === "user"
                    ? "bg-[#3ecf8e] text-[#0f0f0f] rounded-2xl rounded-br-sm"
                    : "bg-[#171717] border border-[#2e2e2e] text-[#fafafa] rounded-2xl rounded-bl-sm"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#3ecf8e] flex items-center justify-center text-[10px] font-semibold text-[#0f0f0f]">
                      NB
                    </div>
                  </div>
                )}
                <p className="text-[14px] leading-[1.5]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  {message.content}
                  {isLoading && message.role === "assistant" && message.content === "" && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
              <p className="text-[12px] text-[#898989] mt-1" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {format(message.timestamp, "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2e2e2e] p-4 md:p-6">
        {isLoading && (
          <p className="text-[12px] text-[#898989] mb-2" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Groq is thinking...
          </p>
        )}
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask me anything about Goa..."
            rows={1}
            className="flex-1 resize-none px-4 py-3 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors disabled:opacity-50"
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", maxHeight: "160px" }}
          />
          <Button
            onClick={() => input.trim() && !isLoading && sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-[#3ecf8e] text-[#0f0f0f] rounded-[8px] hover:bg-[#3ecf8e]/90 transition-colors disabled:opacity-50"
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
