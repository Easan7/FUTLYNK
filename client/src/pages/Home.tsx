/**
 * Home / Discover Games Page - Unique Design
 * Inspired by WHOOP, Nike Training Club - minimal, clean, distinctive
 * Shows only user's skill level + hybrid (unrestricted) rooms
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import { MapPin, Clock, DollarSign, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

// User's current skill level (would come from auth context in real app)
const USER_SKILL_LEVEL = "Intermediate";

// Mock data - only shows user's skill level + hybrid rooms
const mockGames = [
  {
    id: "1",
    location: "Downtown Sports Arena",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    skillLevel: "Intermediate" as const,
    isHybrid: false,
    playersJoined: 7,
    maxPlayers: 10,
    price: 15,
  },
  {
    id: "2",
    location: "Metro Futsal Complex",
    date: "Feb 17, 2026",
    time: "8:00 PM",
    skillLevel: null, // Hybrid room
    isHybrid: true,
    playersJoined: 6,
    maxPlayers: 10,
    price: 18,
  },
  {
    id: "3",
    location: "Westgate Indoor Sports",
    date: "Feb 18, 2026",
    time: "7:30 PM",
    skillLevel: "Intermediate" as const,
    isHybrid: false,
    playersJoined: 5,
    maxPlayers: 10,
    price: 15,
  },
];

export default function Home() {
  const handleQuickJoin = (gameId: string, location: string) => {
    toast.success(`Joined game at ${location}!`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Hero Section - Full bleed with overlay */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663303543939/MhFZtOWemtNHloyp.png"
          alt="Futsal court"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Find Your
            <br />
            <span className="text-[#39ff14]">Perfect Match</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Join skill-balanced futsal games near you. Play with the right team, every time.
          </p>
        </div>
      </div>

      {/* Quick Match Button */}
      <div className="p-4">
        <Link href="/match">
          <button className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Zap className="w-5 h-5" />
            Quick Match
          </button>
        </Link>
      </div>

      {/* Your Skill Level Info */}
      <div className="px-4 mb-4">
        <div className="p-3 bg-[#1a1a1a] border-l-2 border-[#39ff14]">
          <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">
            Your Skill Level
          </p>
          <div className="flex items-center gap-2">
            <SkillBadge level={USER_SKILL_LEVEL as any} />
            <span className="text-xs text-gray-400">
              Showing {USER_SKILL_LEVEL} + Hybrid rooms
            </span>
          </div>
        </div>
      </div>

      {/* Nearby Games */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Nearby Games</h2>
          <span className="text-sm text-gray-500">{mockGames.length} available</span>
        </div>

        {mockGames.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`}>
            <div className="group bg-[#1a1a1a] hover:bg-[#222222] transition-colors relative overflow-hidden">
              {/* Background image with dark overlay */}
              <div className="absolute inset-0 opacity-10">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663303543939/MhFZtOWemtNHloyp.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Diagonal cut */}
              <div
                className="absolute top-0 right-0 w-12 h-12 bg-[#0a0a0a] z-10"
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
              />

              <div className="relative z-10 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {game.isHybrid && (
                      <span className="text-xs font-bold text-[#00d9ff] mb-1 block">
                        HYBRID • No Restrictions
                      </span>
                    )}
                    <h3 className="text-white font-bold mb-1">{game.location}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {game.time}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span>{game.date}</span>
                    </div>
                  </div>

                  <CircularProgress
                    value={game.playersJoined}
                    max={game.maxPlayers}
                    size={64}
                    strokeWidth={5}
                    color="#39ff14"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    {!game.isHybrid && game.skillLevel && (
                      <SkillBadge level={game.skillLevel} />
                    )}
                    <div className="flex items-center gap-1 text-white">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold">{game.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickJoin(game.id, game.location);
                    }}
                    className="px-4 py-2 bg-[#39ff14] text-black font-bold text-sm rounded hover:bg-[#2de00f] transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Navigation />
    </div>
  );
}
