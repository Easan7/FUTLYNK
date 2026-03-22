/**
 * Post-Game Feedback Page - Unique Design
 * Rate players after completed games
 */

import { useState } from "react";
import { Link, useParams } from "wouter";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Star, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import wallpaperImage from "@/assets/images/wallpaper.jpg";

type CompletedGame = {
  id: string;
  location: string;
  date: string;
  time: string;
  players: { id: string; name: string }[];
};

const completedGames: Record<string, CompletedGame> = {
  c1: {
    id: "c1",
    location: "Downtown Sports Arena",
    date: "Feb 10, 2026",
    time: "7:00 PM",
    players: [
      { id: "1", name: "Alex Chen" },
      { id: "2", name: "Jordan Smith" },
      { id: "3", name: "Sam Rivera" },
      { id: "4", name: "Taylor Kim" },
      { id: "5", name: "Morgan Lee" },
      { id: "6", name: "Casey Park" },
      { id: "7", name: "Riley Johnson" },
    ],
  },
  c2: {
    id: "c2",
    location: "Eastside Court",
    date: "Feb 8, 2026",
    time: "6:30 PM",
    players: [
      { id: "8", name: "Diego Martinez" },
      { id: "9", name: "Jamie Wilson" },
      { id: "10", name: "Chris Taylor" },
      { id: "11", name: "Pat Anderson" },
      { id: "12", name: "Aisha Patel" },
      { id: "13", name: "Marcus Chen" },
      { id: "14", name: "Sarah Williams" },
    ],
  },
};

export default function PostGameFeedback() {
  const params = useParams<{ gameId: string }>();
  const currentGame = params?.gameId ? completedGames[params.gameId] : undefined;
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [sportsmanshipFlags, setSportsmanshipFlags] = useState<Set<string>>(new Set());

  const handleRating = (playerId: string, rating: number) => {
    setRatings({ ...ratings, [playerId]: rating });
  };

  const toggleSportsmanshipFlag = (playerId: string) => {
    const newFlags = new Set(sportsmanshipFlags);
    if (newFlags.has(playerId)) {
      newFlags.delete(playerId);
    } else {
      newFlags.add(playerId);
    }
    setSportsmanshipFlags(newFlags);
  };

  const handleSubmit = () => {
    if (!currentGame) {
      toast.error("Game not found.");
      return;
    }

    const ratedCount = Object.keys(ratings).length;
    if (ratedCount < currentGame.players.length) {
      toast.error(`Please rate all ${currentGame.players.length} players`);
      return;
    }

    toast.success("Feedback submitted!", {
      description: "Thank you for helping maintain game quality.",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={wallpaperImage}
          alt="Court texture"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[#030303]/80" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#050505]/85 backdrop-blur-md border-b border-[#1a1a1a] p-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">Rate Players</h1>
              <p className="text-xs text-gray-500">
                {currentGame ? currentGame.location : "Game unavailable"}
              </p>
            </div>
          </div>
        </div>

        {currentGame ? (
          <div className="p-4 space-y-6">
            {/* Game Info */}
            <div className="p-4 bg-[#1a1a1a] border-l-2 border-[#39ff14]">
              <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">
                Completed Game
              </p>
              <p className="text-white font-bold">{currentGame.location}</p>
              <p className="text-gray-400 text-sm">
                {currentGame.date} • {currentGame.time}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Rate Each Player
              </h2>
              <p className="text-xs text-gray-500">
                Your ratings help maintain game quality and match players appropriately.
              </p>
            </div>

            {/* Player Ratings */}
            <div className="space-y-3">
              {currentGame.players.map((player) => (
                <div key={player.id} className="p-4 bg-[#1a1a1a] space-y-3">
                  {/* Player Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                      <AvatarFallback className="bg-[#0f0f0f] text-white text-sm font-bold">
                        {player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium">{player.name}</p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(player.id, star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            ratings[player.id] >= star
                              ? "fill-[#39ff14] text-[#39ff14]"
                              : "text-gray-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Sportsmanship Flag */}
                  <button
                    onClick={() => toggleSportsmanshipFlag(player.id)}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      sportsmanshipFlags.has(player.id)
                        ? "text-red-400"
                        : "text-gray-500 hover:text-gray-400"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flag for poor sportsmanship</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#39ff14] text-black font-bold py-4 rounded-lg hover:bg-[#2de00f] transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] text-center">
              <p className="text-white font-semibold mb-2">Game not found</p>
              <p className="text-xs text-gray-500">
                The session you're trying to rate is no longer available.
              </p>
            </div>
            <Link href="/">
              <button className="w-full bg-[#39ff14] text-black font-bold py-3 rounded-lg hover:bg-[#2de00f] transition-colors">
                Browse Games
              </button>
            </Link>
          </div>
        )}

        <Navigation />
      </div>
    </div>
  );
}
