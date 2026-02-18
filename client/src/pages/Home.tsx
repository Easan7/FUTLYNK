/**
 * Home Page - My Games
 * Shows only joined upcoming games + unrated completed games
 */

import Navigation from "@/components/Navigation";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import gameImage1 from "@/assets/images/game1.jpg";
import gameImage2 from "@/assets/images/game2.jpg";
import wallpaperImage from "@/assets/images/wallpaper.jpg";
import { Clock, DollarSign, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

// Mock data - User's joined games
const myUpcomingGames = [
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
    userJoined: true,
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
    userJoined: true,
  },
];

const unratedGames = [
  {
    id: "c1",
    location: "Downtown Sports Arena",
    date: "Feb 10, 2026",
    time: "7:00 PM",
    playersCount: 10,
    needsRating: true,
  },
];

export default function Home() {
  const handleLeaveGame = (gameId: string, location: string) => {
    toast.success(`Left game at ${location}`);
  };

  return (
    <div className="min-h-screen relative bg-[#0a0a0a] pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#040404]/80" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          <img
            src={wallpaperImage}
            alt="Futsal court"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              My <span className="text-[#39ff14]">Games</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Your upcoming matches and games to rate
            </p>
          </div>
        </div>

        <main className="p-4 space-y-6">
          {/* Upcoming Games */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Upcoming Games
              </h2>
              <span className="text-xs text-gray-500">{myUpcomingGames.length} joined</span>
            </div>

            <div className="space-y-4">
              {myUpcomingGames.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`}>
                  <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all group cursor-pointer">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={game.image}
                        alt={game.location}
                        className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">{game.location}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {game.time}
                            </span>
                            <span>•</span>
                            <span>{game.date}</span>
                          </div>
                        </div>

                        {/* Circular Progress */}
                        <CircularProgress
                          value={game.playersJoined}
                          max={game.maxPlayers}
                          size={60}
                          strokeWidth={4}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4">
                        {game.isHybrid ? (
                          <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400 font-bold uppercase">
                            HYBRID • No Restrictions
                          </div>
                        ) : (
                          <SkillBadge level={game.skillLevel!} />
                        )}

                        <div className="flex items-center gap-1 text-gray-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-bold">{game.price}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLeaveGame(game.id, game.location);
                        }}
                        className="w-full py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#222222] transition-colors text-sm font-bold"
                      >
                        Leave Game
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Games Needing Rating */}
          {unratedGames.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  Rate Players
                </h2>
                <span className="text-xs text-[#39ff14]">{unratedGames.length} pending</span>
              </div>

              <div className="space-y-3">
                {unratedGames.map((game) => (
                  <Link key={game.id} href={`/feedback/${game.id}`}>
                    <div className="p-4 bg-[#1a1a1a] border-l-4 border-[#39ff14] rounded-lg hover:bg-[#222222] transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-sm mb-1">{game.location}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{game.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {game.playersCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[#39ff14]">
                          <Star className="w-5 h-5" />
                          <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">
                            Rate →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {myUpcomingGames.length === 0 && unratedGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No Games Yet</h3>
              <p className="text-gray-500 text-sm mb-6">
                Find and join games from the Quick Find tab
              </p>
              <Link href="/match">
                <button className="px-6 py-3 bg-[#39ff14] text-black rounded-lg font-bold hover:bg-[#2de00f] transition-colors">
                  Find Games
                </button>
              </Link>
            </div>
          )}
        </main>

        <Navigation />
      </div>
    </div>
  );
}
