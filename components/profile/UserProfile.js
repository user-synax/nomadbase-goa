"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, MapPin, Calendar, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import SpaceCard from "@/components/spaces/SpaceCard";

export default function UserProfile({ username }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: "",  
    country: "",
    currentLocation: "",
    skills: [],
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
  });
  const [skillInput, setSkillInput] = useState("");

  const isOwnProfile = session?.user?.id === username;

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      const data = await response.json();
      setUser(data);
      setEditForm({
        bio: data.bio || "",
        country: data.country || "",
        currentLocation: data.currentLocation || "",
        skills: data.skills || [],
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !editForm.skills.includes(skillInput.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s) => s !== skillToRemove) });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
      setIsEditDialogOpen(false);
      fetchUser();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171717]">
        <div className="text-[#898989]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171717]">
        <div className="text-[#898989]">User not found</div>
      </div>
    );
  }

  const nomadYear = user.nomadSince ? new Date(user.nomadSince).getFullYear() : null;
  const initials = user.name?.split(" ").map((n) => n[0]).join("") || "U";

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar size="xl" className="w-32 h-32">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="text-3xl font-semibold bg-[#3ecf8e] text-[#fafafa]">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-[36px] leading-[1.25] font-normal text-[#fafafa] mb-2" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-4 text-[#898989] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {user.currentLocation && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {user.currentLocation}
                      </div>
                    )}
                    {user.country && <span>{user.country}</span>}
                  </div>
                </div>
                {isOwnProfile && (
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-[#fafafa]">
                        <Edit2 size={20} strokeWidth={2} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Bio</label>
                          <Textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            maxLength={200}
                            className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Country</label>
                            <Input
                              value={editForm.country}
                              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                              placeholder="Country"
                              className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Current Location</label>
                            <Input
                              value={editForm.currentLocation}
                              onChange={(e) => setEditForm({ ...editForm, currentLocation: e.target.value })}
                              placeholder="City, State"
                              className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Skills</label>
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                              placeholder="Type a skill and press Enter"
                              className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
                            />
                            <Button type="button" onClick={handleAddSkill} variant="outline" className="border-[#2e2e2e]">
                              <Plus size={16} />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {editForm.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-[#3ecf8e]/20 text-[#3ecf8e] rounded-full text-sm flex items-center gap-2"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="hover:text-[#fafafa]"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium mb-2">Social Links</label>
                          <Input
                            value={editForm.githubUrl}
                            onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                            placeholder="GitHub URL"
                            className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
                          />
                          <Input
                            value={editForm.linkedinUrl}
                            onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                            placeholder="LinkedIn URL"
                            className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989]"
                          />
                        </div>
                        <Button onClick={handleSaveProfile} className="w-full bg-[#3ecf8e] text-[#fafafa]">
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {user.bio && (
                <p className="text-[#898989] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  {user.bio}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-4 mb-4">
                {user.githubUrl && (
                  <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#898989] hover:text-[#3ecf8e] transition-colors">
                    <GitHub size={20} strokeWidth={2} />
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#898989] hover:text-[#3ecf8e] transition-colors">
                    <Linkedin size={20} strokeWidth={2} />
                  </a>
                )}
              </div>

              {/* Nomad Since Badge */}
              {nomadYear && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-full text-[#3ecf8e] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  <Calendar size={14} strokeWidth={2} />
                  Nomad since {nomadYear}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6 mb-8">
            <h2 className="text-[18px] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Stack & Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-[#3ecf8e]/20 text-[#3ecf8e] rounded-full text-sm"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="spaces" className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6">
          <TabsList className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-[9999px] p-1">
            <TabsTrigger value="spaces" className="rounded-[9999px] data-[state=active]:bg-[#3ecf8e] data-[state=active]:text-[#0f0f0f]">
              Spaces Added ({user.stats?.spacesCount || 0})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-[9999px] data-[state=active]:bg-[#3ecf8e] data-[state=active]:text-[#0f0f0f]">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="threads" className="rounded-[9999px] data-[state=active]:bg-[#3ecf8e] data-[state=active]:text-[#0f0f0f]">
              Threads ({user.stats?.threadsCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spaces" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODO: Fetch and render actual spaces */}
              <div className="text-[#898989] text-center py-8 col-span-full">
                No spaces added yet
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-[#898989] text-center py-8">
              No reviews yet
            </div>
          </TabsContent>

          <TabsContent value="threads" className="mt-6">
            <div className="text-[#898989] text-center py-8">
              No threads yet
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
