/**
 * Matchmaking/Search Page - Unique Design
 * Clean search interface with minimal match quality indicators
 */

import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import { Search, MapPin, Clock, DollarSign, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import wallpaperImage from "@/assets/images/wallpaper.jpg";

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
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      toast.success("Found 3 matches!");
    }, 1500);
  };

  const getMatchQualityLabel = (quality: string) => {
    const labels = {
      "best": "Best Match",
      "good": "Good Match",
      "less-suitable": "Less Balanced",
    };
    return labels[quality as keyof typeof labels];
  };

  const getMatchQualityColor = (quality: string) => {
    const colors = {
      "best": "text-[#39ff14]",
      "good": "text-[#00d9ff]",
      "less-suitable": "text-gray-500",
    };
    return colors[quality as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Hero */}
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
            Search for games based on location, time, and skill level
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Form - Minimal */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase text-gray-500 tracking-wide mb-2 block">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-gray-500 tracking-wide mb-2 block">
              Preferred Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["morning", "afternoon", "evening"].map((time) => (
                <button
                  key={time}
                  onClick={() => setPreferredTime(time)}
                  className={`py-2 text-sm font-medium capitalize transition-colors ${
                    preferredTime === time
                      ? "bg-[#39ff14] text-black"
                      : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222222]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Games
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Match Results</h2>
              <span className="text-sm text-gray-500">{matchResults.length} found</span>
            </div>

            {matchResults.map((match) => (
              <Link key={match.id} href={`/game/${match.id}`}>
                <div className="group bg-[#1a1a1a] hover:bg-[#222222] transition-colors overflow-hidden">
                  {/* Diagonal cut */}
                  <div
                    className="absolute top-0 right-0 w-12 h-12 bg-[#0a0a0a]"
                    style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
                  />

                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${getMatchQualityColor(match.matchQuality)}`}>
                            {getMatchQualityLabel(match.matchQuality)}
                          </span>
                        </div>
                        <h3 className="text-white font-bold mb-1">{match.location}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {match.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {match.time}
                          </span>
                        </div>
                      </div>

                      <CircularProgress
                        value={match.playersJoined}
                        max={match.maxPlayers}
                        size={64}
                        strokeWidth={5}
                        color="#39ff14"
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                      <div className="flex items-center gap-3">
                        <SkillBadge level={match.skillLevel} />
                        <div className="flex items-center gap-1 text-white">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-bold">{match.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toast.success(`Joined ${match.location}!`);
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
        )}
      </div>

      <Navigation />
    </div>
  );
}
