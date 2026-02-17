/**
 * Home / Discover Games Page - Unique Design
 * Inspired by WHOOP, Nike Training Club - minimal, clean, distinctive
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

// Mock data
const mockGames = [
  {
    id: "1",
    location: "Downtown Sports Arena",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    skillLevel: "Intermediate" as const,
    playersJoined: 7,
    maxPlayers: 10,
    price: 15,
  },
  {
    id: "2",
    location: "Eastside Futsal Court",
    date: "Feb 16, 2026",
    time: "6:30 PM",
    skillLevel: "Beginner" as const,
    playersJoined: 4,
    maxPlayers: 8,
    price: 12,
  },
  {
    id: "3",
    location: "Metro Futsal Complex",
    date: "Feb 17, 2026",
    time: "8:00 PM",
    skillLevel: "Advanced" as const,
    playersJoined: 9,
    maxPlayers: 10,
    price: 20,
  },
  {
    id: "4",
    location: "Westgate Indoor Sports",
    date: "Feb 18, 2026",
    time: "7:30 PM",
    skillLevel: "Intermediate" as const,
    playersJoined: 5,
    maxPlayers: 10,
    price: 15,
  },
];

export default function Home() {
  const [skillFilter, setSkillFilter] = useState<string>("all");

  const handleQuickJoin = (gameId: string, location: string) => {
    toast.success(`Joined game at ${location}!`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Hero Section - Full bleed with overlay */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        <img
          src="https://cdn.manus.space/file/manus-cdn/futlynk/hero-futsal-night.png"
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

      {/* Filter Bar - Minimal */}
      <div className="px-4 py-4 border-b border-[#1a1a1a]">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSkillFilter("all")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              skillFilter === "all"
                ? "text-[#39ff14] border-b-2 border-[#39ff14]"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            All Levels
          </button>
          <button
            onClick={() => setSkillFilter("beginner")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              skillFilter === "beginner"
                ? "text-[#39ff14] border-b-2 border-[#39ff14]"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setSkillFilter("intermediate")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              skillFilter === "intermediate"
                ? "text-[#39ff14] border-b-2 border-[#39ff14]"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setSkillFilter("advanced")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              skillFilter === "advanced"
                ? "text-[#39ff14] border-b-2 border-[#39ff14]"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Quick Match Button */}
      <div className="px-4 py-4">
        <Link href="/match">
          <button className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Zap className="w-5 h-5" />
            Quick Match
          </button>
        </Link>
      </div>

      {/* Games List - Diagonal cut cards */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Nearby Games</h2>
          <span className="text-sm text-gray-500">{mockGames.length} games found</span>
        </div>

        {mockGames.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`}>
            <div className="group relative bg-[#1a1a1a] overflow-hidden hover:bg-[#222222] transition-colors">
              {/* Diagonal cut top-right corner */}
              <div
                className="absolute top-0 right-0 w-12 h-12 bg-[#0a0a0a]"
                style={{
                  clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                }}
              />

              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <h3 className="text-white font-bold">{game.location}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {game.date} • {game.time}
                      </span>
                    </div>
                  </div>

                  {/* Circular Progress */}
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
                    <SkillBadge level={game.skillLevel} />
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
