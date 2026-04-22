"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUp, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function ThreadCard({ thread }) {
  const { author, title, body, tags, upvotes, replyCount, views, createdAt, pinned, _id } = thread;

  // Format time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
      }
    }
    return "Just now";
  };

  const timeAgo = getTimeAgo(createdAt);
  const bodyPreview = body.length > 120 ? body.substring(0, 120) + "..." : body;

  return (
    <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6 hover:border-[#363636] transition-colors">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar size="sm">
          <AvatarFallback className="text-xs font-semibold bg-[#3ecf8e] text-[#fafafa]">
            {author?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {author?.name}
          </span>
          {author?.country && (
            <>
              <span className="text-[#898989]">•</span>
              <span className="text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {author.country}
              </span>
            </>
          )}
          <span className="text-[#898989]">•</span>
          <span className="text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {timeAgo}
          </span>
        </div>
      </div>

      {/* Title */}
      <Link href={`/community/thread/${_id}`}>
        <h3 className="text-[18px] font-normal text-[#fafafa] mb-2 hover:text-[#3ecf8e] transition-colors" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {pinned && <span className="mr-2">📌</span>}
          {title}
        </h3>
      </Link>

      {/* Body Preview */}
      <p className="text-[14px] text-[#898989] mb-3" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
        {bodyPreview}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-[#2e2e2e] text-[#b4b4b4] text-xs rounded-full"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center gap-4 text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
        <button className="flex items-center gap-1 hover:text-[#3ecf8e] transition-colors">
          <ArrowUp size={16} strokeWidth={2} />
          <span>{upvotes?.length || 0}</span>
        </button>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} strokeWidth={2} />
          <span>{replyCount || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye size={16} strokeWidth={2} />
          <span>{views || 0}</span>
        </div>
      </div>
    </div>
  );
}
