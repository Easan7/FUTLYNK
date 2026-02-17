/**
 * Home / Discover Games Page - Unique Design
 * Inspired by WHOOP, Nike Training Club - minimal, clean, distinctive
 * Shows only user's skill level + hybrid (unrestricted) rooms
 */

import Navigation from "@/components/Navigation";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import gameImage1 from "@/assets/images/game1.jpg";
import gameImage2 from "@/assets/images/game2.jpg";
import gameImage3 from "@/assets/images/game3.png";
import wallpaperImage from "@/assets/images/wallpaper.jpg";
import backupImage from "@/assets/images/backup.png";
import { Clock, DollarSign, Users } from "lucide-react";
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
    image: gameImage1,
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
    image: gameImage2,
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
    image: gameImage3,
  },
];

const mockCompletedGames = [
  {
    id: "c1",
    location: "Downtown Sports Arena",
    date: "Feb 10, 2026",
    time: "7:00 PM",
    result: "5 v 5",
    feedbackPending: true,
  },
  {
    id: "c2",
    location: "Eastside Court",
    date: "Feb 8, 2026",
    time: "6:30 PM",
    result: "4 v 4",
    feedbackPending: false,
  },
];

export default function Home() {
  const handleQuickJoin = (gameId: string, location: string) => {
    toast.success(`Joined game at ${location}!`);
  };

  return (
    <div className="min-h-screen relative bg-[#0a0a0a] pb-20 overflow-hidden">
      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[#040404]/80" />
      </div>

      <div className="relative z-10">
        {/* Hero Section - Full bleed with overlay */}
        <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          <img
            src={wallpaperImage}
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


        {/* Your Skill Level Info */}
        <div className="px-4 mb-4">
          <div className="p-3 bg-[#1a1a1a]/80 border border-[#1f1f1f] border-l-2 border-l-[#39ff14] backdrop-blur-sm">
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
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Nearby Games</h2>
            <span className="text-sm text-gray-500">{mockGames.length} available</span>
          </div>

          {mockGames.map((game) => (
            <Link key={game.id} href={`/game/${game.id}`} className="block">
              <div className="group bg-[#101010]/90 hover:bg-[#161616]/90 backdrop-blur-sm transition-colors relative overflow-hidden border border-[#1f1f1f]">
                {/* Background image with stronger dark overlay */}
                <div className="absolute inset-0">
                  <img
                    src={game.image}
                    alt=""
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-black/75" />
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

        {/* Completed Games */}
        <div className="px-4 mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Completed</h2>
            <span className="text-sm text-gray-500">{mockCompletedGames.length} sessions</span>
          </div>

          {mockCompletedGames.map((game) => (
            <Link key={game.id} href={`/feedback/${game.id}`} className="block">
              <div className="bg-[#101010]/90 hover:bg-[#151515]/90 backdrop-blur-sm border border-[#1f1f1f] p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-semibold text-sm">{game.location}</p>
                  <p className="text-xs text-gray-500">
                    {game.date} • {game.time}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {game.result}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  {game.feedbackPending ? (
                    <span className="text-[10px] uppercase tracking-wide text-[#ffae00]">Feedback Needed</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wide text-gray-500">Completed</span>
                  )}
                  <button className="px-3 py-1 text-xs font-bold text-black bg-[#39ff14] rounded hover:bg-[#2de00f]">
                    Rate Game
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Navigation />
      </div>

    </div>
  );
}
