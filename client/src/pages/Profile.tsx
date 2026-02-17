/**
 * Profile Page - Cyberpunk Athleticism
 * Focus on skill level, achievements/tags, matches played, and match history (no wins/losses/scores)
 */

import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Trophy,
  Calendar,
  Award,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";

// Mock data
const mockProfile = {
  name: "Alex Chen",
  skillLevel: "Intermediate" as const,
  matchesPlayed: 47,
  attendanceRate: 95,
  tags: [
    { id: "1", name: "Reliable", icon: CheckCircle2, color: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
    { id: "2", name: "Team Player", icon: Award, color: "bg-green-500/20 text-green-400 border-green-500/50" },
    { id: "3", name: "Forward", icon: Trophy, color: "bg-red-500/20 text-red-400 border-red-500/50" },
    { id: "4", name: "Punctual", icon: CheckCircle2, color: "bg-purple-500/20 text-purple-400 border-purple-500/50" },
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

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-[#39ff14]/50">
              <AvatarFallback className="bg-gradient-to-br from-[#39ff14] to-[#00d9ff] text-black text-2xl font-bold">
                AC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{mockProfile.name}</h2>
              <div className="mt-2">
                <SkillBadge level={mockProfile.skillLevel} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#39ff14]/20">
            <div className="bg-[#0f0f0f] rounded-lg p-3">
              <p className="text-xs text-gray-400">Matches Played</p>
              <p className="text-2xl text-white font-bold">{mockProfile.matchesPlayed}</p>
            </div>
            <div className="bg-[#0f0f0f] rounded-lg p-3">
              <p className="text-xs text-gray-400">Attendance Rate</p>
              <p className="text-2xl text-[#39ff14] font-bold">{mockProfile.attendanceRate}%</p>
            </div>
          </div>
        </Card>

        {/* Tags & Achievements */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#39ff14]" />
            Tags & Achievements
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {mockProfile.tags.map((tag) => {
              const Icon = tag.icon;
              return (
                <div
                  key={tag.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border ${tag.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{tag.name}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Match History */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#39ff14]" />
            Match History
          </h3>

          <div className="space-y-2">
            {mockProfile.matchHistory.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#39ff14]" />
                    <span className="text-sm font-semibold text-white">{match.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{match.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{match.players} players</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
}
