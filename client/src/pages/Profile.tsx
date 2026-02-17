/**
 * Profile Page - Cyberpunk Athleticism
 * Focus on skill level, achievements/tags, matches played, and match history (no wins/losses/scores)
 * Inspired by Nike Run Club, Strava, and ESPN app designs
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
  Shield,
  Zap,
  Target,
  Clock,
  TrendingUp,
} from "lucide-react";

// Mock data
const mockProfile = {
  name: "Alex Chen",
  skillLevel: "Intermediate" as const,
  matchesPlayed: 47,
  attendanceRate: 95,
  tags: [
    { id: "1", name: "Reliable", icon: Shield, gradient: "from-blue-500 to-blue-600", iconColor: "text-blue-400" },
    { id: "2", name: "Team Player", icon: Users, gradient: "from-green-500 to-emerald-600", iconColor: "text-green-400" },
    { id: "3", name: "Forward", icon: Zap, gradient: "from-red-500 to-orange-600", iconColor: "text-red-400" },
    { id: "4", name: "Punctual", icon: Clock, gradient: "from-purple-500 to-purple-600", iconColor: "text-purple-400" },
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

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card - Inspired by Strava */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/30 bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 backdrop-blur-xl p-6 space-y-5 shadow-[0_8px_32px_rgba(57,255,20,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-[#00d9ff]/5" />
          
          <div className="relative flex flex-col items-center">
            {/* Large Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#39ff14] to-[#00d9ff] rounded-full blur-xl opacity-50" />
              <Avatar className="relative w-24 h-24 border-4 border-[#39ff14]/50 shadow-[0_0_30px_rgba(57,255,20,0.3)]">
                <AvatarFallback className="bg-gradient-to-br from-[#39ff14] to-[#00d9ff] text-black text-3xl font-bold">
                  AC
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name & Skill */}
            <h2 className="text-2xl font-bold text-white mt-4">{mockProfile.name}</h2>
            <div className="mt-2">
              <SkillBadge level={mockProfile.skillLevel} />
            </div>
          </div>

          {/* Stats Grid - Inspired by Nike Run Club */}
          <div className="relative grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a]/80 to-[#0f0f0f]/80 p-4 border border-[#39ff14]/20">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#39ff14]/10 rounded-full blur-2xl" />
              <div className="relative flex flex-col items-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Matches</p>
                <p className="text-4xl text-white font-bold">{mockProfile.matchesPlayed}</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a]/80 to-[#0f0f0f]/80 p-4 border border-[#00d9ff]/20">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#00d9ff]/10 rounded-full blur-2xl" />
              <div className="relative flex flex-col items-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Attendance</p>
                <p className="text-4xl text-[#39ff14] font-bold">{mockProfile.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Player Tags - Inspired by real sports apps */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#39ff14]" />
            Player Tags
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {mockProfile.tags.map((tag) => {
              const Icon = tag.icon;
              return (
                <div
                  key={tag.id}
                  className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${tag.gradient} p-4 border border-white/10 hover:scale-105 transition-transform shadow-lg`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black/20">
                      <Icon className={`w-5 h-5 ${tag.iconColor}`} />
                    </div>
                    <span className="text-sm font-bold text-white">{tag.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements - Hexagonal badges inspired by gaming UIs */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#39ff14]" />
            Achievements
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            {mockProfile.achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`relative w-16 h-16 flex items-center justify-center rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-[#39ff14]/20 to-[#00d9ff]/20 border-[#39ff14]/50 shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                        : "bg-[#0a0a0a]/50 border-gray-700/50 grayscale opacity-40"
                    }`}
                  >
                    {achievement.unlocked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/10 to-[#00d9ff]/10 rounded-xl" />
                    )}
                    <Icon
                      className={`relative w-7 h-7 ${
                        achievement.unlocked ? "text-[#39ff14]" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <p className={`text-xs text-center font-semibold ${
                    achievement.unlocked ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {achievement.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Match History - Clean list design */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#39ff14]" />
            Match History
          </h3>
          
          <div className="space-y-2">
            {mockProfile.matchHistory.map((match) => (
              <div
                key={match.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a]/80 to-[#0f0f0f]/80 p-4 border border-[#39ff14]/10 hover:border-[#39ff14]/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#39ff14]/0 via-[#39ff14]/5 to-[#00d9ff]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
                      <Calendar className="w-4 h-4 text-[#39ff14]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{match.venue}</p>
                      <p className="text-xs text-gray-400">{match.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30">
                    <Users className="w-3.5 h-3.5 text-[#00d9ff]" />
                    <span className="text-xs font-bold text-[#00d9ff]">{match.players}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
