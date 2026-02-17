/**
 * Matchmaking/Search Page - Cyberpunk Athleticism Design
 * Search for suitable games based on location, time, and skill bands
 * Shows match quality indicators (Best Match, Good Match, Less Suitable)
 * Enhanced with glassmorphism and modern card designs
 */

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Clock, Users, Star, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { toast } from "sonner";

interface MatchResult {
  id: string;
  location: string;
  address: string;
  date: string;
  time: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  playersJoined: number;
  maxPlayers: number;
  price: number;
  distance: string;
  matchQuality: "best" | "good" | "less-suitable";
}

export default function Matchmaking() {
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [location, setLocation] = useState("");
  const [preferredTime, setPreferredTime] = useState("evening");
  const [skillLevel, setSkillLevel] = useState("intermediate");

  const [matchResults] = useState<MatchResult[]>([
    {
      id: "1",
      location: "Downtown Sports Arena",
      address: "123 Main St",
      date: "Feb 15, 2026",
      time: "7:00 PM",
      skillLevel: "Intermediate",
      playersJoined: 7,
      maxPlayers: 10,
      price: 15,
      distance: "0.8 km",
      matchQuality: "best",
    },
    {
      id: "2",
      location: "Metro Futsal Complex",
      address: "456 Metro Ave",
      date: "Feb 15, 2026",
      time: "7:30 PM",
      skillLevel: "Intermediate",
      playersJoined: 6,
      maxPlayers: 10,
      price: 15,
      distance: "1.2 km",
      matchQuality: "good",
    },
    {
      id: "3",
      location: "Westgate Indoor Sports",
      address: "789 West Rd",
      date: "Feb 16, 2026",
      time: "6:30 PM",
      skillLevel: "Advanced",
      playersJoined: 5,
      maxPlayers: 10,
      price: 20,
      distance: "2.5 km",
      matchQuality: "less-suitable",
    },
  ]);

  const handleSearch = () => {
    setIsSearching(true);
    toast.info("Searching for suitable games...");
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      toast.success(`Found ${matchResults.length} suitable games!`);
    }, 1500);
  };

  const getMatchQualityConfig = (quality: string) => {
    switch (quality) {
      case "best":
        return {
          label: "Best Match",
          icon: Star,
          gradient: "from-[#39ff14] to-[#00d9ff]",
          glow: "shadow-[0_0_20px_rgba(57,255,20,0.3)]",
        };
      case "good":
        return {
          label: "Good Match",
          icon: TrendingUp,
          gradient: "from-[#00d9ff] to-[#0099ff]",
          glow: "shadow-[0_0_15px_rgba(0,217,255,0.2)]",
        };
      case "less-suitable":
        return {
          label: "Less Balanced",
          icon: CheckCircle2,
          gradient: "from-yellow-400 to-orange-400",
          glow: "shadow-[0_0_10px_rgba(251,191,36,0.2)]",
        };
      default:
        return {
          label: "Match",
          icon: CheckCircle2,
          gradient: "from-gray-400 to-gray-500",
          glow: "",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#39ff14]" />
          <h1 className="text-2xl font-bold text-white">Find a Game</h1>
        </div>
        <p className="text-sm text-gray-400">
          Search for games based on your preferences
        </p>
      </div>

      {/* Search Form */}
      <div className="p-4 space-y-4">
        {/* Glassmorphism Search Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/30 bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(57,255,20,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-[#00d9ff]/5" />
          <div className="relative space-y-4">
            {/* Location Input */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#39ff14]" />
                <Input
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-11 bg-[#0a0a0a]/50 border-[#39ff14]/30 text-white placeholder:text-gray-500 focus:border-[#39ff14] transition-all"
                />
              </div>
            </div>

            {/* Time & Skill Selects */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Time</label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger className="bg-[#0a0a0a]/50 border-[#39ff14]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Skill Level</label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="bg-[#0a0a0a]/50 border-[#39ff14]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-bold py-6 text-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Games
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#39ff14]" />
              {matchResults.length} Games Found
            </h2>

            {matchResults.map((match) => {
              const qualityConfig = getMatchQualityConfig(match.matchQuality);
              const QualityIcon = qualityConfig.icon;

              return (
                <Link key={match.id} href={`/game/${match.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#39ff14]/50 hover:shadow-[0_8px_32px_rgba(57,255,20,0.2)]">
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${qualityConfig.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
                    
                    {/* Match Quality Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${qualityConfig.gradient} ${qualityConfig.glow}`}>
                        <QualityIcon className="w-4 h-4 text-black" />
                        <span className="text-xs font-bold text-black">{qualityConfig.label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{match.location}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 text-[#39ff14]" />
                          <span>{match.address}</span>
                          <span className="text-[#00d9ff]">• {match.distance}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#39ff14]" />
                          <span className="text-gray-300">{match.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[#00d9ff]" />
                          <span className="text-gray-300">{match.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#39ff14]/10">
                        <div className="flex items-center gap-3">
                          <SkillBadge level={match.skillLevel} />
                          <div className="flex items-center gap-1.5 text-sm">
                            <Users className="w-4 h-4 text-[#39ff14]" />
                            <span className="text-white font-semibold">
                              {match.playersJoined}/{match.maxPlayers}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#39ff14]">${match.price}</p>
                          <p className="text-xs text-gray-400">per player</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
