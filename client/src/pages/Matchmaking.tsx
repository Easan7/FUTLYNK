/**
 * Matchmaking/Search Page - Cyberpunk Athleticism Design
 * Search for suitable games based on location, time, and skill bands
 * Shows match quality indicators (Best Match, Good Match, Less Suitable)
 */

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Clock, Users, Star, TrendingUp, CheckCircle2 } from "lucide-react";
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
          bgColor: "bg-[#39ff14]/10",
          borderColor: "border-[#39ff14]/50",
          textColor: "text-[#39ff14]",
        };
      case "good":
        return {
          label: "Good Match",
          icon: TrendingUp,
          bgColor: "bg-[#00d9ff]/10",
          borderColor: "border-[#00d9ff]/50",
          textColor: "text-[#00d9ff]",
        };
      case "less-suitable":
        return {
          label: "Less Balanced",
          icon: CheckCircle2,
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/50",
          textColor: "text-yellow-400",
        };
      default:
        return {
          label: "Match",
          icon: CheckCircle2,
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/50",
          textColor: "text-gray-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <h1 className="text-2xl font-bold text-white mb-2">Find a Game</h1>
        <p className="text-sm text-gray-400">
          Search for games based on your preferences
        </p>
      </div>

      {/* Search Form */}
      <div className="p-4 space-y-4">
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-4">
          {/* Location Input */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-[#0f0f0f] border-[#39ff14]/30 text-white"
              />
            </div>
          </div>

          {/* Preferred Time */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Preferred Time</label>
            <Select value={preferredTime} onValueChange={setPreferredTime}>
              <SelectTrigger className="bg-[#0f0f0f] border-[#39ff14]/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
                <SelectItem value="night">Night (10PM - 12AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skill Level */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your Skill Level</label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger className="bg-[#0f0f0f] border-[#39ff14]/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-semibold hover:opacity-90"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search for Games
              </>
            )}
          </Button>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-[#39ff14]/5 to-[#00d9ff]/5 border-[#39ff14]/30 p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[#39ff14] mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Smart Matching</h3>
              <p className="text-sm text-gray-400">
                We find games based on your location, time preferences, and skill band.
                Games are tagged by match quality to help you choose.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {matchResults.length} Games Found
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResults(false)}
              className="text-gray-400"
            >
              Clear
            </Button>
          </div>

          {matchResults.map((match) => {
            const qualityConfig = getMatchQualityConfig(match.matchQuality);
            const QualityIcon = qualityConfig.icon;

            return (
              <Link key={match.id} href={`/game/${match.id}`}>
                <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 hover:border-[#39ff14]/40 transition-all cursor-pointer">
                  {/* Match Quality Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      className={`${qualityConfig.bgColor} ${qualityConfig.textColor} border ${qualityConfig.borderColor}`}
                    >
                      <QualityIcon className="w-3 h-3 mr-1" />
                      {qualityConfig.label}
                    </Badge>
                    <span className="text-xs text-gray-400">{match.distance} away</span>
                  </div>

                  {/* Location */}
                  <div className="mb-3">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {match.location}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{match.address}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#39ff14]" />
                      <span className="text-gray-300">{match.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-[#00d9ff]" />
                      <span className="text-gray-300">{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#39ff14]" />
                      <span className="text-gray-300">
                        {match.playersJoined}/{match.maxPlayers} players
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-[#39ff14] font-bold">${match.price}</span>
                      <span className="text-gray-400"> per player</span>
                    </div>
                  </div>

                  {/* Skill Level */}
                  <div className="flex items-center justify-between">
                    <SkillBadge level={match.skillLevel} />
                    <div className="text-xs text-gray-400">
                      {match.maxPlayers - match.playersJoined} spots left
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <Navigation />
    </div>
  );
}
