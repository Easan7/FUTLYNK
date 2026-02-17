/**
 * Post-Game Feedback Page - Unique Design
 * Rate players after completed games
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Star, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const mockCompletedGame = {
  id: "completed-1",
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
};

export default function PostGameFeedback() {
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
    const ratedCount = Object.keys(ratings).length;
    if (ratedCount < mockCompletedGame.players.length) {
      toast.error(`Please rate all ${mockCompletedGame.players.length} players`);
      return;
    }

    toast.success("Feedback submitted!", {
      description: "Thank you for helping maintain game quality.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] p-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">Rate Players</h1>
            <p className="text-xs text-gray-500">{mockCompletedGame.location}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Game Info */}
        <div className="p-4 bg-[#1a1a1a] border-l-2 border-[#39ff14]">
          <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">
            Completed Game
          </p>
          <p className="text-white font-bold">{mockCompletedGame.location}</p>
          <p className="text-gray-400 text-sm">
            {mockCompletedGame.date} • {mockCompletedGame.time}
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
          {mockCompletedGame.players.map((player) => (
            <div key={player.id} className="p-4 bg-[#1a1a1a] space-y-3">
              {/* Player Info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                  <AvatarFallback className="bg-[#0f0f0f] text-white text-sm font-bold">
                    {player.name.split(" ").map((n) => n[0]).join("")}
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
          className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-bold py-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Submit Feedback
        </button>
      </div>

      <Navigation />
    </div>
  );
}
