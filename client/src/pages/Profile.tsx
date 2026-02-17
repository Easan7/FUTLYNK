/**
 * Profile Page - Unique Design
 * Large numbers, minimal cards, clean achievement badges
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Calendar,
  Award,
  CheckCircle2,
  MapPin,
  Users,
  Shield,
  Zap,
  Target,
  Clock,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockProfile = {
  name: "Alex Chen",
  skillLevel: "Intermediate" as const,
  matchesPlayed: 47,
  attendanceRate: 95,
  tags: [
    { id: "1", name: "Reliable", icon: Shield },
    { id: "2", name: "Team Player", icon: Users },
    { id: "3", name: "Forward", icon: Zap },
    { id: "4", name: "Punctual", icon: Clock },
  ],
  achievements: [
    { id: "1", name: "10 Games", icon: Trophy, unlocked: true },
    { id: "2", name: "Perfect Attendance", icon: CheckCircle2, unlocked: true },
    { id: "3", name: "50 Games", icon: Award, unlocked: false },
    { id: "4", name: "Team Captain", icon: Target, unlocked: false },
  ],
  matchHistory: [
    { id: "1", date: "Feb 10, 2026", venue: "Downtown Arena", players: 10 },
    { id: "2", date: "Feb 8, 2026", venue: "Eastside Court", players: 10 },
    { id: "3", date: "Feb 5, 2026", venue: "Metro Complex", players: 8 },
    { id: "4", date: "Feb 3, 2026", venue: "Westgate Sports", players: 10 },
    { id: "5", date: "Jan 30, 2026", venue: "Riverside Hub", players: 10 },
    { id: "6", date: "Jan 27, 2026", venue: "Downtown Arena", players: 10 },
  ],
};

const mockFriends = [
  { id: "1", name: "Marcus Chen", skillLevel: "Advanced" as const },
  { id: "2", name: "Sarah Williams", skillLevel: "Intermediate" as const },
  { id: "3", name: "Diego Martinez", skillLevel: "Advanced" as const },
  { id: "4", name: "Aisha Patel", skillLevel: "Intermediate" as const },
];

export default function Profile() {
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddFriend = (name: string) => {
    toast.success(`Friend request sent to ${name}!`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] p-4">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header - Centered, minimal */}
        <div className="flex flex-col items-center py-6 space-y-4">
          <Avatar className="w-24 h-24 border-2 border-[#2a2a2a]">
            <AvatarFallback className="bg-[#1a1a1a] text-white text-3xl font-bold">
              AC
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white">{mockProfile.name}</h2>
            <SkillBadge level={mockProfile.skillLevel} />
            
            {/* Friends Buttons */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  setShowFriends(true);
                  setShowAddFriends(false);
                }}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#222222] transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Friends
              </button>
              <button
                onClick={() => {
                  setShowAddFriends(true);
                  setShowFriends(false);
                }}
                className="px-4 py-2 bg-[#39ff14] text-black rounded-lg hover:bg-[#2de00f] transition-colors flex items-center gap-2 font-bold"
              >
                <UserPlus className="w-4 h-4" />
                Add Friends
              </button>
            </div>
          </div>
        </div>

        {/* Stats - Large numbers (WHOOP style) */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-6xl font-bold text-white mb-1">{mockProfile.matchesPlayed}</p>
            <p className="text-[10px] uppercase text-gray-500 tracking-wide">Matches Played</p>
          </div>
          
          <div className="text-center">
            <p className="text-6xl font-bold text-[#39ff14] mb-1">{mockProfile.attendanceRate}%</p>
            <p className="text-[10px] uppercase text-gray-500 tracking-wide">Attendance</p>
          </div>
        </div>

        {/* Player Tags - Outlined pills */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Player Tags</h3>
          
          <div className="flex flex-wrap gap-2">
            {mockProfile.tags.map((tag) => {
              const Icon = tag.icon;
              return (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-700 rounded-full hover:border-gray-600 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{tag.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements - Simple grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Achievements</h3>
          
          <div className="grid grid-cols-4 gap-3">
            {mockProfile.achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all ${
                      achievement.unlocked
                        ? "bg-[#1a1a1a] border-[#39ff14]"
                        : "bg-[#0a0a0a] border-gray-800 opacity-40"
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        achievement.unlocked ? "text-[#39ff14]" : "text-gray-700"
                      }`}
                    />
                  </div>
                  <p className={`text-[10px] text-center ${
                    achievement.unlocked ? "text-gray-400" : "text-gray-700"
                  }`}>
                    {achievement.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Match History - Minimal list */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Match History</h3>
          
          <div className="space-y-2">
            {mockProfile.matchHistory.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222222] transition-colors border-l-2 border-[#39ff14]"
              >
                <div>
                  <p className="text-white font-medium text-sm">{match.venue}</p>
                  <p className="text-gray-500 text-xs">{match.date}</p>
                </div>
                
                <div className="flex items-center gap-1 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{match.players}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Friends Modal */}
      {showFriends && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#0a0a0a] rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Friends ({mockFriends.length})</h2>
              <button
                onClick={() => setShowFriends(false)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {mockFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                    <AvatarFallback className="bg-[#0f0f0f] text-white text-sm">
                      {friend.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{friend.name}</p>
                    <SkillBadge level={friend.skillLevel} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Friends Modal */}
      {showAddFriends && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#0a0a0a] rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Friends</h2>
              <button
                onClick={() => setShowAddFriends(false)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or username..."
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
              
              <div className="space-y-2">
                {["Jamie Wilson", "Chris Taylor", "Pat Anderson"].map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg"
                  >
                    <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                      <AvatarFallback className="bg-[#0f0f0f] text-white text-sm">
                        {name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{name}</p>
                    </div>
                    <button
                      onClick={() => handleAddFriend(name)}
                      className="px-3 py-1 bg-[#39ff14] text-black rounded font-bold text-sm hover:bg-[#2de00f] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
