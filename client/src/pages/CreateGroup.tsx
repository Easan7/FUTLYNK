/**
 * Create Group Page - Unique Design
 * Minimal form for creating social groups
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, X, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { Link } from "wouter";

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
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] p-4">
        <div className="flex items-center gap-3">
          <Link href="/groups">
            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-white">Create Group</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Group Name */}
        <div>
          <label className="text-[10px] uppercase text-gray-500 tracking-wide mb-2 block">
            Group Name
          </label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Friday Night Squad"
            className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-lg"
          />
        </div>

        {/* Add Friends */}
        <div>
          <label className="text-[10px] uppercase text-gray-500 tracking-wide mb-2 block">
            Add Friends
          </label>
          <Input
            value={friendSearch}
            onChange={(e) => setFriendSearch(e.target.value)}
            placeholder="Search friends..."
            className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
          />

          {/* Search Results */}
          {friendSearch && filteredFriends.length > 0 && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleAddFriend(friend.name)}
                  className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222222] transition-colors text-left"
                >
                  <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                    <AvatarFallback className="bg-[#0f0f0f] text-white text-sm">
                      {friend.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{friend.name}</p>
                    <p className="text-gray-500 text-xs">{friend.skillLevel}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Friends */}
        {selectedFriends.length > 0 && (
          <div>
            <label className="text-[10px] uppercase text-gray-500 tracking-wide mb-2 block">
              Group Members ({selectedFriends.length})
            </label>
            <div className="space-y-2">
              {selectedFriends.map((name) => {
                const friend = availableFriends.find((f) => f.name === name);
                return (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 bg-[#1a1a1a]"
                  >
                    <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                      <AvatarFallback className="bg-[#0f0f0f] text-white text-sm">
                        {name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{name}</p>
                      <p className="text-gray-500 text-xs">{friend?.skillLevel}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(name)}
                      className="p-2 hover:bg-[#222222] rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Group Summary */}
        {selectedFriends.length > 0 && (
          <div className="p-4 bg-[#1a1a1a] border-l-2 border-[#39ff14]">
            <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-2">
              Group Summary
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{selectedFriends.length + 1}</p>
                <p className="text-xs text-gray-400">Total Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#39ff14]">{getSkillMix()}</p>
                <p className="text-xs text-gray-400">Skill Mix</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {getSkillMix() === "Mixed"
                ? "Will match to unrestricted rooms"
                : "Will prioritize banded games"}
            </p>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || selectedFriends.length === 0}
          className="w-full bg-[#39ff14] text-black font-bold py-4 rounded-lg hover:bg-[#2de00f] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Create Group
        </button>
      </div>

      <Navigation />
    </div>
  );
}
