"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReplyBox from "@/components/community/ReplyBox";
import { ArrowUp, MessageCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const editThreadSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title must be at most 100 characters"),
  body: z.string().min(20, "Body must be at least 20 characters").max(2000, "Body must be at most 2000 characters"),
  tags: z.array(z.string().max(20, "Each tag must be at most 20 characters")).max(3, "Maximum 3 tags allowed").optional().default([]),
});

function getTimeAgo(date) {
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
}

export default function ThreadClient({ threadId, serverData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [thread, setThread] = useState(serverData.thread);
  const [replies, setReplies] = useState(serverData.replies || []);
  const [upvoteCount, setUpvoteCount] = useState(serverData.upvoteCount || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [isAuthor, setIsAuthor] = useState(serverData.isAuthor || false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [editData, setEditData] = useState({
    title: "",
    body: "",
    tags: [],
  });

  // Debug logging
  useEffect(() => {
    console.log("=== ThreadClient Debug ===");
    console.log("serverData.isAuthor:", serverData.isAuthor);
    console.log("session?.user?.email:", session?.user?.email);
    console.log("thread?.author?._id:", thread?.author?._id);
    console.log("thread?.author:", thread?.author);
  }, []);

  useEffect(() => {
    if (thread) {
      setUpvoteCount(thread.upvotes?.length || 0);
    }
  }, [thread]);

  // Check author status - works regardless of server-side check
  useEffect(() => {
    if (!serverData.isAuthor && session?.user?.email && thread?.author) {
      const authorId = thread.author._id || thread.author.id;
      fetch(`/api/users/by-email?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(user => {
          const userIdStr = user._id?.toString();
          const authorIdStr = authorId?.toString();
          console.log("Client check - userId:", userIdStr, "authorId:", authorIdStr, "match:", userIdStr === authorIdStr);
          if (userIdStr === authorIdStr) {
            setIsAuthor(true);
          }
        })
        .catch(console.error);
    } else if (serverData.isAuthor) {
      setIsAuthor(true);
    }
  }, [session, thread, serverData.isAuthor]);

  const handleUpvote = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    try {
      const response = await fetch(`/api/community/${threadId}/upvote`, {
        method: "POST",
      });
      const data = await response.json();
      
      if (response.ok) {
        setUpvoted(data.upvoted);
        setUpvoteCount(data.count);
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Failed to upvote");
    }
  };

  const handleReplyAdded = (newReply) => {
    setReplies([...replies, newReply]);
    setThread({ ...thread, replyCount: (thread.replyCount || 0) + 1 });
  };

  const handleEditClick = () => {
    setEditData({
      title: thread.title,
      body: thread.body,
      tags: thread.tags || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editData.tags.includes(tagInput.trim()) && editData.tags.length < 3) {
      setEditData({ ...editData, tags: [...editData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditData({ ...editData, tags: editData.tags.filter((t) => t !== tagToRemove) });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const validatedData = editThreadSchema.parse(editData);

      const response = await fetch(`/api/community/${threadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update thread");
      }

      toast.success("Thread updated successfully!");
      setThread({ ...thread, ...validatedData });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Edit thread error:", error);
      if (error.name === "ZodError") {
        const errors = {};
        error.errors?.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFieldErrors(errors);
      } else {
        toast.error(error.message || "Failed to update thread");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/community/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete thread");
      }

      toast.success("Thread deleted successfully!");
      router.push("/community");
    } catch (error) {
      console.error("Delete thread error:", error);
      toast.error(error.message || "Failed to delete thread");
    }
  };

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#171717] pt-16 flex items-center justify-center">
        <div className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Thread not found
        </div>
      </div>
    );
  }

  const timeAgo = getTimeAgo(thread.createdAt);

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Thread Content */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6 mb-6">
          {/* Author Info */}
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
                {timeAgo}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[24px] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {thread.title}
          </h1>

          {/* Body */}
          <div className="text-[16px] text-[#b4b4b4] mb-4 whitespace-pre-wrap" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {thread.body}
          </div>

          {/* Tags */}
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

          {/* Actions Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2e2e2e]">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleUpvote}
                className={`flex items-center gap-1 text-sm transition-colors ${upvoted ? "text-[#3ecf8e]" : "text-[#898989] hover:text-[#3ecf8e]"}`}
              >
                <ArrowUp size={18} strokeWidth={2} />
                <span>{upvoteCount}</span>
              </button>
              <div className="flex items-center gap-1 text-sm text-[#898989]">
                <MessageCircle size={18} strokeWidth={2} />
                <span>{thread.replyCount || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#898989]">
                <Eye size={18} strokeWidth={2} />
                <span>{thread.views || 0}</span>
              </div>
            </div>

            {/* Edit/Delete for author */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-[#898989] hover:text-[#fafafa] transition-colors"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-[#898989] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-6">
          <h2 className="text-[18px] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Replies ({replies.length})
          </h2>
          
          {replies.length === 0 ? (
            <div className="text-[#898989] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              No replies yet. Be the first to reply!
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply._id} className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs font-semibold bg-[#3ecf8e] text-[#fafafa]">
                        {reply.author?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
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
                  <div className="text-[14px] text-[#b4b4b4] whitespace-pre-wrap" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {reply.body}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Box */}
        <ReplyBox threadId={threadId} onReplyAdded={handleReplyAdded} />

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setFieldErrors({});
            setTagInput("");
          }
        }}>
          <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] max-w-2xl w-[95%] mx-auto z-50">
            <DialogHeader>
              <DialogTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Edit Thread
              </DialogTitle>
              <DialogDescription className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Update your thread details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Title
                </label>
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="bg-[#0f0f0f] text-[#fafafa] placeholder:text-[#898989]"
                  style={{
                    borderColor: fieldErrors.title ? "#ef4444" : "#2e2e2e",
                    outline: "none",
                  }}
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {fieldErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Body
                </label>
                <Textarea
                  value={editData.body}
                  onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                  rows={6}
                  className="bg-[#0f0f0f] text-[#fafafa] placeholder:text-[#898989]"
                  style={{
                    borderColor: fieldErrors.body ? "#ef4444" : "#2e2e2e",
                    outline: "none",
                  }}
                />
                {fieldErrors.body && (
                  <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {fieldErrors.body}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Tags (max 3)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Type and press Enter to add tag"
                    className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-[#2e2e2e] text-[#fafafa]"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#3ecf8e]/20 text-[#3ecf8e] rounded-full text-sm flex items-center gap-2"
                      style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[#fafafa]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-[#2e2e2e] text-[#fafafa] w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-[#0f0f0f] w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] max-w-md w-[95%] mx-auto z-50">
            <DialogHeader>
              <DialogTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Delete Thread
              </DialogTitle>
              <DialogDescription className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Are you sure you want to delete this thread? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-[#2e2e2e] text-[#fafafa] w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-[#fafafa] w-full sm:w-auto"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}