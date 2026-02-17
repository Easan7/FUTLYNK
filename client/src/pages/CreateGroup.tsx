/**
 * Create Group Page - Cyberpunk Athleticism Design
 * Form informal social groups with friends or past teammates
 * System will recommend suitable rooms for the group
 * Enhanced with modern card designs and interactive elements
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, X, ArrowLeft, Sparkles, UserPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

export default function CreateGroup() {
  const [, setLocation] = useLocation();
  const [groupName, setGroupName] = useState("");
  const [friendSearch, setFriendSearch] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Mock friends list
  const availableFriends = [
    { id: "1", name: "Marcus Chen", skillLevel: "Advanced" },
    { id: "2", name: "Sarah Williams", skillLevel: "Intermediate" },
    { id: "3", name: "Diego Martinez", skillLevel: "Advanced" },
    { id: "4", name: "Aisha Patel", skillLevel: "Intermediate" },
    { id: "5", name: "Tom Rodriguez", skillLevel: "Beginner" },
  ];

  const filteredFriends = availableFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(friendSearch.toLowerCase()) &&
      !selectedFriends.includes(friend.name)
  );

  const handleAddFriend = (name: string) => {
    setSelectedFriends([...selectedFriends, name]);
    setFriendSearch("");
    toast.success(`${name} added to group`);
  };

  const handleRemoveFriend = (name: string) => {
    setSelectedFriends(selectedFriends.filter((f) => f !== name));
    toast.info(`${name} removed from group`);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    if (selectedFriends.length === 0) {
      toast.error("Please add at least one friend");
      return;
    }

    toast.success(`Group "${groupName}" created!`, {
      description: "We'll analyze preferences and recommend suitable games.",
    });
    setTimeout(() => setLocation("/groups"), 1000);
  };

  const getSkillMix = () => {
    const friendSkills = selectedFriends.map((name) => {
      const friend = availableFriends.find((f) => f.name === name);
      return friend?.skillLevel;
    });
    const uniqueSkills = new Set(friendSkills);
    return uniqueSkills.size > 1 ? "Mixed" : "Same";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setLocation("/groups")} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Sparkles className="w-6 h-6 text-[#39ff14]" />
          <h1 className="text-2xl font-bold text-white">Create Group</h1>
        </div>
        <p className="text-sm text-gray-400">
          Form a social group to find games together
        </p>
      </div>

      {/* Info Card - Glassmorphism */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/30 bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 backdrop-blur-xl p-5 shadow-[0_8px_32px_rgba(57,255,20,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-[#00d9ff]/5" />
          <div className="relative flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#39ff14]/20 to-[#00d9ff]/20 border border-[#39ff14]/30">
              <Users className="w-5 h-5 text-[#39ff14]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1">Smart Group Matching</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We'll analyze your group's preferences to recommend suitable games.
                Mixed skill groups get unrestricted rooms, while same-level groups are
                prioritized for banded games.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 space-y-4">
        {/* Group Name Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#39ff14]/10 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Group Name</label>
            <Input
              type="text"
              placeholder="e.g., Weekend Warriors"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-[#0a0a0a]/50 border-[#39ff14]/30 text-white placeholder:text-gray-500 focus:border-[#39ff14] transition-all"
            />
          </div>
        </div>

        {/* Add Friends Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-4">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#00d9ff]/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative">
            <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#39ff14]" />
              Add Friends
            </label>
            <Input
              type="text"
              placeholder="Search friends..."
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
              className="bg-[#0a0a0a]/50 border-[#39ff14]/30 text-white placeholder:text-gray-500 focus:border-[#39ff14] transition-all"
            />
          </div>

          {/* Friend Search Results */}
          {friendSearch && filteredFriends.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleAddFriend(friend.name)}
                  className="w-full flex items-center justify-between p-3 bg-[#0a0a0a]/50 rounded-xl border border-[#39ff14]/10 hover:border-[#39ff14]/30 hover:bg-[#0a0a0a]/80 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-[#39ff14]/30">
                      <AvatarFallback className="bg-gradient-to-br from-[#39ff14]/20 to-[#00d9ff]/20 text-[#39ff14] font-bold">
                        {friend.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{friend.name}</p>
                      <p className="text-xs text-gray-400">{friend.skillLevel}</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-[#39ff14]/10 group-hover:bg-[#39ff14]/20 transition-colors">
                    <Plus className="w-4 h-4 text-[#39ff14]" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Friends */}
          {selectedFriends.length > 0 && (
            <div className="relative">
              <p className="text-xs font-semibold text-gray-400 mb-2">
                Selected ({selectedFriends.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFriends.map((name) => {
                  const friend = availableFriends.find((f) => f.name === name);
                  return (
                    <div
                      key={name}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#39ff14]/10 to-[#00d9ff]/10 border border-[#39ff14]/30 hover:border-[#39ff14]/50 transition-all"
                    >
                      <Avatar className="w-6 h-6 border border-[#39ff14]/30">
                        <AvatarFallback className="bg-[#39ff14]/20 text-[#39ff14] text-xs font-bold">
                          {name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold text-white">{name}</span>
                      <button
                        onClick={() => handleRemoveFriend(name)}
                        className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Group Summary */}
        {selectedFriends.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#39ff14]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-4 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 via-transparent to-[#00d9ff]/5" />
            
            <div className="relative">
              <h3 className="text-sm font-bold text-white mb-3">Group Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a]/80 to-[#0f0f0f]/80 p-4 border border-[#39ff14]/20">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#39ff14]/10 rounded-full blur-2xl" />
                  <p className="text-xs text-gray-400 mb-1">Total Members</p>
                  <p className="text-3xl text-white font-bold relative">
                    {selectedFriends.length + 1}
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a]/80 to-[#0f0f0f]/80 p-4 border border-[#00d9ff]/20">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#00d9ff]/10 rounded-full blur-2xl" />
                  <p className="text-xs text-gray-400 mb-1">Skill Mix</p>
                  <Badge
                    className={`mt-1 font-bold ${
                      getSkillMix() === "Same"
                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/50"
                        : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/50"
                    }`}
                  >
                    {getSkillMix()} Level
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                {getSkillMix() === "Same"
                  ? "Your group will be prioritized for skill-banded games."
                  : "Your group will be matched to unrestricted rooms."}
              </p>
            </div>
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreateGroup}
          className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-bold py-6 text-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Create Group
        </Button>
      </div>

      <Navigation />
    </div>
  );
}
