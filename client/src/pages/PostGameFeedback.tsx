/**
 * Post-Game Feedback Page - Cyberpunk Athleticism Design
 * Rate and tag players after a game
 */

import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, ThumbsUp, Clock, Users, Zap, Shield, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

interface Player {
  id: number;
  name: string;
  skillLevel: string;
  rating?: number;
  tags?: string[];
}

const availableTags = [
  { icon: Clock, label: "Punctual", color: "text-blue-400" },
  { icon: ThumbsUp, label: "Good Sport", color: "text-green-400" },
  { icon: Users, label: "Team Player", color: "text-purple-400" },
  { icon: Zap, label: "Skilled", color: "text-yellow-400" },
  { icon: Shield, label: "Reliable", color: "text-cyan-400" },
  { icon: Award, label: "MVP", color: "text-orange-400" },
];

export default function PostGameFeedback() {
  const [, params] = useRoute("/feedback/:gameId");
  const [, setLocation] = useLocation();
  const gameId = params?.gameId || "1";

  const [players] = useState<Player[]>([
    { id: 1, name: "Marcus Chen", skillLevel: "Advanced" },
    { id: 2, name: "Sarah Williams", skillLevel: "Intermediate" },
    { id: 3, name: "Diego Martinez", skillLevel: "Advanced" },
    { id: 4, name: "Aisha Patel", skillLevel: "Intermediate" },
    { id: 5, name: "Tom Rodriguez", skillLevel: "Beginner" },
    { id: 6, name: "Lisa Kim", skillLevel: "Intermediate" },
  ]);

  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [selectedTags, setSelectedTags] = useState<Record<number, string[]>>({});

  const handleRating = (playerId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [playerId]: rating }));
  };

  const handleTagToggle = (playerId: number, tag: string) => {
    setSelectedTags((prev) => {
      const playerTags = prev[playerId] || [];
      const newTags = playerTags.includes(tag)
        ? playerTags.filter((t) => t !== tag)
        : [...playerTags, tag];
      return { ...prev, [playerId]: newTags };
    });
  };

  const handleSubmit = () => {
    const ratedCount = Object.keys(ratings).length;
    if (ratedCount === 0) {
      toast.error("Please rate at least one player");
      return;
    }
    toast.success(`Feedback submitted for ${ratedCount} players!`);
    setTimeout(() => setLocation("/"), 1000);
  };

  const handleSkip = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Post-Game Feedback</h1>
            <p className="text-sm text-gray-400 mt-1">
              Rate your teammates and help build a better community
            </p>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-[#39ff14]/10 to-[#00d9ff]/10 border-[#39ff14]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Game #{gameId}</h3>
              <p className="text-sm text-gray-400">Completed • 2 hours ago</p>
            </div>
            <Badge className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/50">
              6v6
            </Badge>
          </div>
        </Card>
      </div>

      {/* Players List */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-white">Rate Your Teammates</h2>

        {players.map((player) => (
          <Card
            key={player.id}
            className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 hover:border-[#39ff14]/30 transition-all"
          >
            {/* Player Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39ff14]/30 to-[#00d9ff]/30 flex items-center justify-center border-2 border-[#39ff14]/50">
                  <span className="text-sm font-bold text-white">
                    {player.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{player.name}</h3>
                  <p className="text-xs text-gray-400">{player.skillLevel}</p>
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">Overall Performance</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(player.id, star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (ratings[player.id] || 0) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Add Tags (Optional)</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const Icon = tag.icon;
                  const isSelected = (selectedTags[player.id] || []).includes(tag.label);
                  return (
                    <button
                      key={tag.label}
                      onClick={() => handleTagToggle(player.id, tag.label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-[#39ff14]/20 border-[#39ff14]/50 text-[#39ff14]"
                          : "bg-[#0f0f0f] border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#39ff14]" : tag.color}`} />
                      <span className="text-xs font-medium">{tag.label}</span>
                      {isSelected && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div className="flex gap-3">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[#39ff14] text-black hover:bg-[#39ff14]/90 font-semibold"
          >
            Submit Feedback
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
