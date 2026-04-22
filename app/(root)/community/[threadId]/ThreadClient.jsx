"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, MessageCircle, ArrowUp, Trash2 } from "lucide-react";
import ReplyBox from "@/components/community/ReplyBox";
import ReactMarkdown from "react-markdown";

export default function ThreadClient({
  threadId,
  serverData,
  onReplyAdded,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [thread, setThread] = useState(serverData?.thread || null);
  const [replies, setReplies] = useState(serverData?.replies || []);
  const [loading, setLoading] = useState(false);
  const [upvoted, setUpvoted] = useState(serverData?.upvoted || false);
  const [upvoteCount, setUpvoteCount] = useState(serverData?.upvoteCount || 0);

  useEffect(() => {
    // Client-only effects can go here if needed
  }, []);

  const fetchThread = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/${threadId}`);
      const data = await response.json();

      setThread(data.thread);
      setReplies(data.replies || []);
      setUpvoteCount(data.thread?.upvotes?.length || 0);
      setUpvoted(data.thread?.upvotes?.includes(session?.user?.id) || false);
    } catch (error) {
      console.error("Error fetching thread:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const response = await fetch(`/api/community/${threadId}/upvote`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to toggle upvote");
      }

      setUpvoted(data.upvoted);
      setUpvoteCount(data.count);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this thread?")) return;

    try {
      const response = await fetch(`/api/community/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }

      router.push("/community");
    } catch (error) {
      console.error("Failed to delete thread:", error);
    }
  };

  const handleReplyAdded = (newReply) => {
    if (onReplyAdded) {
      onReplyAdded(newReply);
    }
    setReplies([...replies, newReply]);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171717] pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Loading thread...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#171717] pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Thread not found
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnThread = session?.user?.id === thread.author?._id;

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Thread Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar size="sm">
              <AvatarFallback className="text-xs font-semibold bg-[#3ecf8e] text-[#fafafa]">
                {thread.author?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {thread.author?.name}
              </span>
              {thread.author?.country && (
                <>
                  <span className="text-[#898989]">•</span>
                  <span className="text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {thread.author.country}
                  </span>
                </>
              )}
              <span className="text-[#898989]">•</span>
              <span className="text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {getTimeAgo(thread.createdAt)}
              </span>
            </div>
          </div>

          <h1 className="text-[36px] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {thread.pinned && <span className="mr-2">📌</span>}
            {thread.title}
          </h1>

          {thread.tags && thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {thread.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#2e2e2e] text-[#b4b4b4] text-sm rounded-full"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            <div className="flex items-center gap-1">
              <Eye size={16} strokeWidth={2} />
              <span>{thread.views || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={16} strokeWidth={2} />
              <span>{thread.replyCount || 0} replies</span>
            </div>
          </div>
        </div>

        {/* Thread Body */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6 mb-8">
          <div className="prose prose-invert max-w-none text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            <ReactMarkdown>{thread.body}</ReactMarkdown>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#2e2e2e]">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              upvoted
                ? "bg-[#3ecf8e] text-[#0f0f0f]"
                : "bg-[#2e2e2e] text-[#fafafa] hover:bg-[#363636]"
            }`}
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            <ArrowUp size={18} strokeWidth={2} />
            <span>{upvoteCount}</span>
          </button>

          {isOwnThread && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#fafafa] hover:bg-[#2e2e2e] transition-colors"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              <Trash2 size={18} strokeWidth={2} />
              Delete
            </button>
          )}
        </div>

        {/* Replies Section */}
        <div className="mb-8">
          <h2 className="text-[24px] font-normal text-[#fafafa] mb-6" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h2>

          {replies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                No replies yet. Be the first to reply!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply._id} className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs font-semibold bg-[#3ecf8e] text-[#fafafa]">
                        {reply.author?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {reply.author?.name}
                      </span>
                      {reply.author?.country && (
                        <>
                          <span className="text-[#898989]">•</span>
                          <span className="text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                            {reply.author.country}
                          </span>
                        </>
                      )}
                      <span className="text-[#898989]">•</span>
                      <span className="text-sm text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        {getTimeAgo(reply.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-[#fafafa] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    <ReactMarkdown>{reply.body}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Box */}
        <ReplyBox threadId={threadId} onReplyAdded={handleReplyAdded} />
      </div>
    </div>
  );
}