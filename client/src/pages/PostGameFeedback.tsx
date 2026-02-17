/**
 * Post-Game Feedback Page - Cyberpunk Athleticism
 * Rate players after completed games (5 stars + optional sportsmanship flag)
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

interface PlayerRating {
  playerId: string;
  rating: number;
  sportsmanshipFlag: boolean;
}

const mockCompletedGame = {
  id: "completed-1",
  location: "Downtown Sports Arena",
  date: "Feb 10, 2026",
  time: "7:00 PM",
  players: [
    { id: "1", name: "Marcus Chen" },
    { id: "2", name: "Sarah Williams" },
    { id: "3", name: "Diego Martinez" },
    { id: "4", name: "Aisha Patel" },
    { id: "5", name: "Tom Rodriguez" },
    { id: "6", name: "Emma Johnson" },
    { id: "7", name: "Liam Brown" },
  ],
};

export default function PostGameFeedback() {
  const [, setLocation] = useLocation();
  const [ratings, setRatings] = useState<PlayerRating[]>(
    mockCompletedGame.players.map((p) => ({
      playerId: p.id,
      rating: 0,
      sportsmanshipFlag: false,
    }))
  );

  const handleRatingChange = (playerId: string, rating: number) => {
    setRatings((prev) =>
      prev.map((r) => (r.playerId === playerId ? { ...r, rating } : r))
    );
  };

  const handleSportsmanshipToggle = (playerId: string) => {
    setRatings((prev) =>
      prev.map((r) =>
        r.playerId === playerId
          ? { ...r, sportsmanshipFlag: !r.sportsmanshipFlag }
          : r
      )
    );
  };

  const handleSubmit = () => {
    const unratedPlayers = ratings.filter((r) => r.rating === 0);
    if (unratedPlayers.length > 0) {
      toast.error("Please rate all players before submitting");
      return;
    }

    toast.success("Feedback submitted successfully!");
    setTimeout(() => setLocation("/"), 1000);
  };

  const getRatingForPlayer = (playerId: string) => {
    return ratings.find((r) => r.playerId === playerId)?.rating || 0;
  };

  const getSportsmanshipFlag = (playerId: string) => {
    return ratings.find((r) => r.playerId === playerId)?.sportsmanshipFlag || false;
  };

  const allRated = ratings.every((r) => r.rating > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setLocation("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Rate Players</h1>
        </div>
        <p className="text-sm text-gray-400">
          {mockCompletedGame.location} • {mockCompletedGame.date}
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-[#39ff14]/5 to-[#00d9ff]/5 border-[#39ff14]/30 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#39ff14] mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Game Completed</h3>
              <p className="text-sm text-gray-400">
                Please rate each player's performance. Ratings help improve match quality.
                Optionally flag poor sportsmanship.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Player Ratings */}
      <div className="px-4 space-y-3">
        {mockCompletedGame.players.map((player) => {
          const playerRating = getRatingForPlayer(player.id);
          const hasSportsmanshipFlag = getSportsmanshipFlag(player.id);

          return (
            <Card key={player.id} className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-[#39ff14]/30">
                  <AvatarFallback className="bg-[#39ff14]/10 text-[#39ff14] font-semibold">
                    {player.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{player.name}</p>
                  {playerRating > 0 && (
                    <Badge className="mt-1 bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/50">
                      {playerRating} {playerRating === 1 ? "star" : "stars"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(player.id, star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= playerRating
                          ? "fill-[#39ff14] text-[#39ff14]"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Sportsmanship Flag */}
              <div className="flex items-center gap-2 p-2 bg-[#0f0f0f] rounded-lg">
                <Checkbox
                  id={`sportsmanship-${player.id}`}
                  checked={hasSportsmanshipFlag}
                  onCheckedChange={() => handleSportsmanshipToggle(player.id)}
                  className="border-red-500/50 data-[state=checked]:bg-red-500"
                />
                <label
                  htmlFor={`sportsmanship-${player.id}`}
                  className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Flag for poor sportsmanship
                </label>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="p-4">
        <Button
          onClick={handleSubmit}
          disabled={!allRated}
          className={`w-full py-6 text-lg font-semibold ${
            allRated
              ? "bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black hover:opacity-90"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {allRated ? "Submit Ratings" : `Rate ${ratings.filter((r) => r.rating === 0).length} more players`}
        </Button>
      </div>

      <Navigation />
    </div>
  );
}
