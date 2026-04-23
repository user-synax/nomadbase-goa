"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for client-side validation
const replySchema = z.object({
  body: z.string().min(10, "Reply must be at least 10 characters").max(1000, "Reply must be at most 1000 characters"),
});

export default function ReplyBox({ threadId, onReplyAdded }) {
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validatedData = replySchema.parse({ body });

      console.log("Submitting reply to:", `/api/community/${threadId}/replies`);

      const response = await fetch(`/api/community/${threadId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();
      console.log("Reply response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to post reply");
      }

      toast.success("Reply posted successfully!");
      setBody("");
      
      // Notify parent component
      if (onReplyAdded) {
        onReplyAdded(data);
      }
    } catch (error) {
      console.error("Reply error:", error);
      if (error.name === "ZodError") {
        toast.error(error.errors?.[0]?.message || "Validation error");
      } else {
        toast.error(error.message || "Failed to post reply");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6 text-center">
        <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          <a href="/signin" className="text-[#3ecf8e] hover:underline">
            Sign in
          </a>{" "}
          to reply to this thread
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your reply... (10-1000 characters)"
            rows={4}
            className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !body.trim()}
            className="bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-[#0f0f0f]"
          >
            {isSubmitting ? "Posting..." : "Post Reply"}
          </Button>
        </div>
      </form>
    </div>
  );
}
