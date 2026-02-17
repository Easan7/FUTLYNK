/**
 * Groups Page - Cyberpunk Athleticism Design
 * Create and manage social groups, find matches for groups
 */

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Search, Calendar, MapPin, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
  members: string[];
  skillMix: "Same" | "Mixed";
  gamesPlayed: number;
  nextGame?: string;
}

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [groups] = useState<Group[]>([
    {
      id: 1,
      name: "Weekend Warriors",
      members: ["Marcus", "Sarah", "Diego", "You"],
      skillMix: "Mixed",
      gamesPlayed: 23,
      nextGame: "Tomorrow, 6:00 PM",
    },
    {
      id: 2,
      name: "Friday Night Futsal",
      members: ["Aisha", "Tom", "Lisa", "You"],
      skillMix: "Same",
      gamesPlayed: 15,
    },
    {
      id: 3,
      name: "Office Squad",
      members: ["John", "Emma", "Mike", "You", "Alex"],
      skillMix: "Mixed",
      gamesPlayed: 8,
      nextGame: "Friday, 7:30 PM",
    },
  ]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      toast.success(`Group "${newGroupName}" created!`);
      setNewGroupName("");
      setIsCreateDialogOpen(false);
    } else {
      toast.error("Please enter a group name");
    }
  };

  const handleFindMatch = (groupName: string) => {
    toast.info(`Finding matches for ${groupName}...`);
  };

  const handleInviteMembers = (groupName: string) => {
    toast.info(`Opening invite dialog for ${groupName}...`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#39ff14]" />
            <h1 className="text-2xl font-bold text-white">Groups</h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/50 hover:bg-[#39ff14]/20">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-[#39ff14]/30 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Group Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Weekend Warriors"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-[#0f0f0f] border-[#39ff14]/30 text-white"
                  />
                </div>
                <Button
                  onClick={handleCreateGroup}
                  className="w-full bg-[#39ff14] text-black hover:bg-[#39ff14]/90"
                >
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#39ff14]/30 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-[#39ff14]/5 to-[#00d9ff]/5 border-[#39ff14]/30 p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[#39ff14] mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Smart Group Matching</h3>
              <p className="text-sm text-gray-400">
                We analyze your group's preferences to recommend suitable games or suggest
                minimal scheduling adjustments.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Groups List */}
      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold text-white mb-3">
          {filteredGroups.length} Groups
        </h2>

        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 hover:border-[#39ff14]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-lg">{group.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`text-xs ${
                      group.skillMix === "Same"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                        : "bg-purple-500/20 text-purple-400 border-purple-500/50"
                    }`}
                  >
                    {group.skillMix} Skill Level
                  </Badge>
                  <span className="text-sm text-gray-400">
                    {group.members.length} members
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Games Played</p>
                <p className="text-lg text-[#39ff14] font-bold">{group.gamesPlayed}</p>
              </div>
            </div>

            {/* Members */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">Members</p>
              <div className="flex flex-wrap gap-2">
                {group.members.map((member, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-[#0f0f0f] text-gray-300 border-gray-700"
                  >
                    {member}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Next Game */}
            {group.nextGame && (
              <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-[#39ff14]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Next Game: {group.nextGame}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleFindMatch(group.name)}
                className="flex-1 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/50 hover:bg-[#39ff14]/20"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Match
              </Button>
              <Button
                onClick={() => handleInviteMembers(group.name)}
                className="flex-1 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/50 hover:bg-[#00d9ff]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="px-4 py-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No groups found</h3>
          <p className="text-gray-400 text-sm mb-4">
            Create a group to play with your friends
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Group
          </Button>
        </div>
      )}

      <Navigation />
    </div>
  );
}
