/**
 * Friends Page - Cyberpunk Athleticism Design
 * Manage friends list, view profiles, create groups
 */

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus, MessageCircle, Shield, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

interface Friend {
  id: number;
  name: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  gamesPlayed: number;
  reliability: number;
  tags: string[];
  isOnline: boolean;
}

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends] = useState<Friend[]>([
    {
      id: 1,
      name: "Marcus Chen",
      skillLevel: "Advanced",
      rating: 1850,
      gamesPlayed: 127,
      reliability: 98,
      tags: ["Team Player", "Punctual", "Skilled"],
      isOnline: true,
    },
    {
      id: 2,
      name: "Sarah Williams",
      skillLevel: "Intermediate",
      rating: 1520,
      gamesPlayed: 64,
      reliability: 95,
      tags: ["Friendly", "Reliable"],
      isOnline: true,
    },
    {
      id: 3,
      name: "Diego Martinez",
      skillLevel: "Advanced",
      rating: 1780,
      gamesPlayed: 98,
      reliability: 92,
      tags: ["Competitive", "Skilled"],
      isOnline: false,
    },
    {
      id: 4,
      name: "Aisha Patel",
      skillLevel: "Intermediate",
      rating: 1450,
      gamesPlayed: 52,
      reliability: 97,
      tags: ["Supportive", "Team Player"],
      isOnline: true,
    },
  ]);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = () => {
    toast.success("Friend request sent!");
  };

  const handleMessage = (name: string) => {
    toast.info(`Opening chat with ${name}...`);
  };

  const handleBlock = (name: string) => {
    toast.error(`${name} added to blacklist`);
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case "Beginner":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#39ff14]" />
            <h1 className="text-2xl font-bold text-white">Friends</h1>
          </div>
          <Button
            onClick={handleAddFriend}
            className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/50 hover:bg-[#39ff14]/20"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#39ff14]/30 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <Link href="/groups">
          <Card className="bg-gradient-to-r from-[#00d9ff]/10 to-[#39ff14]/10 border-[#00d9ff]/30 p-4 hover:border-[#00d9ff]/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#00d9ff]" />
                <div>
                  <h3 className="text-white font-semibold">Create a Group</h3>
                  <p className="text-sm text-gray-400">Form a team with friends</p>
                </div>
              </div>
              <div className="text-[#00d9ff]">→</div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Friends List */}
      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold text-white mb-3">
          {filteredFriends.length} Friends
        </h2>

        {filteredFriends.map((friend) => (
          <Card
            key={friend.id}
            className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 hover:border-[#39ff14]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#39ff14]/30 to-[#00d9ff]/30 flex items-center justify-center border-2 border-[#39ff14]/50">
                    <span className="text-lg font-bold text-white">
                      {friend.name.charAt(0)}
                    </span>
                  </div>
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39ff14] rounded-full border-2 border-[#1a1a1a]" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-white font-semibold">{friend.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getSkillColor(friend.skillLevel)}`}>
                      {friend.skillLevel}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {friend.rating} ELO
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white font-semibold">
                  {(friend.rating / 400).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#0f0f0f] rounded-lg p-2">
                <p className="text-xs text-gray-400">Games Played</p>
                <p className="text-sm text-white font-semibold">{friend.gamesPlayed}</p>
              </div>
              <div className="bg-[#0f0f0f] rounded-lg p-2">
                <p className="text-xs text-gray-400">Reliability</p>
                <p className="text-sm text-[#39ff14] font-semibold">{friend.reliability}%</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {friend.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-[#39ff14]/5 text-[#39ff14] border-[#39ff14]/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleMessage(friend.name)}
                className="flex-1 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/50 hover:bg-[#00d9ff]/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Link href={`/profile?id=${friend.id}`} className="flex-1">
                <Button className="w-full bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/50 hover:bg-[#39ff14]/20">
                  View Profile
                </Button>
              </Link>
              <Button
                onClick={() => handleBlock(friend.name)}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Navigation />
    </div>
  );
}
