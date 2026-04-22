"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThreadCard from "@/components/community/ThreadCard";
import { Plus, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for client-side validation
const createThreadSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title must be at most 100 characters"),
  body: z.string().min(20, "Body must be at least 20 characters").max(2000, "Body must be at most 2000 characters"),
  tags: z.array(z.string().max(20, "Each tag must be at most 20 characters")).max(3, "Maximum 3 tags allowed").optional().default([]),
});

export default function CommunityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // New thread form state
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchThreads();
  }, [selectedTag, sort]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTag) params.append("tag", selectedTag);
      params.append("sort", sort);
      
      const response = await fetch(`/api/community?${params.toString()}`);
      const data = await response.json();
      
      setThreads(data.threads || []);
      setTags(data.tags || []);
    } catch (error) {
      console.error("Error fetching threads:", error);
      toast.error("Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 3) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validatedData = createThreadSchema.parse(formData);

      const response = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create thread");
      }

      toast.success("Thread created successfully!");
      setIsDialogOpen(false);
      setFormData({ title: "", body: "", tags: [] });
      setTagInput("");
      
      // Redirect to the new thread
      router.push(`/community/thread/${data._id}`);
    } catch (error) {
      if (error.name === "ZodError" && error.errors && error.errors[0]) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to create thread");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartThread = () => {
    if (!session) {
      router.push("/signin");
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-[16px] font-medium text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Filter by Tag
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTag === null
                      ? "bg-[#3ecf8e] text-[#0f0f0f]"
                      : "text-[#898989] hover:bg-[#2e2e2e] hover:text-[#fafafa]"
                  }`}
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  All Tags
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTag === tag
                        ? "bg-[#3ecf8e] text-[#0f0f0f]"
                        : "text-[#898989] hover:bg-[#2e2e2e] hover:text-[#fafafa]"
                    }`}
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-[16px] font-medium text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Sort By
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSort("recent")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      sort === "recent"
                        ? "bg-[#3ecf8e] text-[#0f0f0f]"
                        : "text-[#898989] hover:bg-[#2e2e2e] hover:text-[#fafafa]"
                    }`}
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  >
                    Recent
                  </button>
                  <button
                    onClick={() => setSort("popular")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      sort === "popular"
                        ? "bg-[#3ecf8e] text-[#0f0f0f]"
                        : "text-[#898989] hover:bg-[#2e2e2e] hover:text-[#fafafa]"
                    }`}
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  >
                    Popular
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-[28px] sm:text-[36px] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Community
              </h1>
              <button
                onClick={handleStartThread}
                className="px-6 py-2 text-[14px] font-medium text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-[9999px] w-full sm:w-auto flex items-center justify-center gap-2 border-none cursor-pointer"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                <Plus size={16} />
                Start a Thread
              </button>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2e2e2e] text-[#fafafa] rounded-lg text-sm w-full justify-center" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    <Filter size={16} />
                    Filters
                    {selectedTag && <span className="text-[#3ecf8e]">({selectedTag})</span>}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-[#171717] border-[#2e2e2e]">
                  <SheetHeader>
                    <SheetTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      Filter Threads
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setSelectedTag(null);
                            setIsFilterSheetOpen(false);
                          }}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedTag === null
                              ? "bg-[#3ecf8e] text-[#0f0f0f]"
                              : "bg-[#2e2e2e] text-[#898989]"
                          }`}
                          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                        >
                          All
                        </button>
                        {tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSelectedTag(tag);
                              setIsFilterSheetOpen(false);
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                              selectedTag === tag
                                ? "bg-[#3ecf8e] text-[#0f0f0f]"
                                : "bg-[#2e2e2e] text-[#898989]"
                            }`}
                            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                        Sort By
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSort("recent");
                            setIsFilterSheetOpen(false);
                          }}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                            sort === "recent"
                              ? "bg-[#3ecf8e] text-[#0f0f0f]"
                              : "bg-[#2e2e2e] text-[#898989]"
                          }`}
                          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                        >
                          Recent
                        </button>
                        <button
                          onClick={() => {
                            setSort("popular");
                            setIsFilterSheetOpen(false);
                          }}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                            sort === "popular"
                              ? "bg-[#3ecf8e] text-[#0f0f0f]"
                              : "bg-[#2e2e2e] text-[#898989]"
                          }`}
                          style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                        >
                          Popular
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Thread List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Loading threads...
                </div>
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  No threads yet. Be the first to start a conversation!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <ThreadCard key={thread._id} thread={thread} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Thread Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] max-w-2xl w-[95%] mx-auto z-50">
          <DialogHeader>
            <DialogTitle className="text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Start a New Thread
            </DialogTitle>
            <DialogDescription className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Create a new thread to start a conversation with the community.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Thread title (10-100 characters)"
                className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Body
              </label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="What's on your mind? (20-2000 characters)"
                rows={6}
                className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
              />
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
                {formData.tags.map((tag) => (
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
                onClick={() => setIsDialogOpen(false)}
                className="border-[#2e2e2e] text-[#fafafa] w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-[#0f0f0f] w-full sm:w-auto"
              >
                {isSubmitting ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
