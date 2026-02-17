/**
 * Create Group Page - Cyberpunk Athleticism Design
 * Form informal social groups with friends or past teammates
 * System will recommend suitable rooms for the group
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, X, ArrowLeft } from "lucide-react";
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
  };

  const handleRemoveFriend = (name: string) => {
    setSelectedFriends(selectedFriends.filter((f) => f !== name));
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
          <button onClick={() => setLocation("/groups")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Create Group</h1>
        </div>
        <p className="text-sm text-gray-400">
          Form a social group to find games together
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-[#39ff14]/5 to-[#00d9ff]/5 border-[#39ff14]/30 p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#39ff14] mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Smart Group Matching</h3>
              <p className="text-sm text-gray-400">
                We'll analyze your group's preferences to recommend suitable games.
                Mixed skill groups get unrestricted rooms, while same-level groups are
                prioritized for banded games.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Form */}
      <div className="px-4 space-y-4">
        {/* Group Name */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Group Name</label>
            <Input
              type="text"
              placeholder="e.g., Weekend Warriors"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-[#0f0f0f] border-[#39ff14]/30 text-white"
            />
          </div>
        </Card>

        {/* Add Friends */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Add Friends</label>
            <Input
              type="text"
              placeholder="Search friends..."
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
              className="bg-[#0f0f0f] border-[#39ff14]/30 text-white"
            />
          </div>

          {/* Friend Search Results */}
          {friendSearch && filteredFriends.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => handleAddFriend(friend.name)}
                  className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-sm text-white font-semibold">{friend.name}</p>
                    <p className="text-xs text-gray-400">{friend.skillLevel}</p>
                  </div>
                  <Plus className="w-4 h-4 text-[#39ff14]" />
                </div>
              ))}
            </div>
          )}

          {/* Selected Friends */}
          {selectedFriends.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">
                Selected ({selectedFriends.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFriends.map((name) => (
                  <Badge
                    key={name}
                    className="bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/50 pr-1"
                  >
                    {name}
                    <button
                      onClick={() => handleRemoveFriend(name)}
                      className="ml-2 hover:bg-[#39ff14]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Group Summary */}
        {selectedFriends.length > 0 && (
          <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Group Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f0f0f] rounded-lg p-3">
                <p className="text-xs text-gray-400">Total Members</p>
                <p className="text-lg text-white font-bold">
                  {selectedFriends.length + 1}
                </p>
              </div>
              <div className="bg-[#0f0f0f] rounded-lg p-3">
                <p className="text-xs text-gray-400">Skill Mix</p>
                <Badge
                  className={`mt-1 ${
                    getSkillMix() === "Same"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/50"
                  }`}
                >
                  {getSkillMix()} Level
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {getSkillMix() === "Same"
                ? "Your group will be prioritized for skill-banded games."
                : "Your group will be matched to unrestricted rooms."}
            </p>
          </Card>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreateGroup}
          className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-semibold hover:opacity-90 py-6 text-lg"
        >
          Create Group
        </Button>
      </div>

      <Navigation />
    </div>
  );
}
