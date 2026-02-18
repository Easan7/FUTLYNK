/**
 * Matchmaking/Search Page - Available Rooms
 * Shows all available rooms with filters and search
 */

import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import { Search, MapPin, Clock, DollarSign, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import wallpaperImage from "@/assets/images/wallpaper.jpg";
import gameImage1 from "@/assets/images/game1.jpg";
import gameImage2 from "@/assets/images/game2.jpg";
import gameImage3 from "@/assets/images/game3.png";

// User's current skill level
const USER_SKILL_LEVEL = "Intermediate";

// Available rooms - user's skill level + hybrid
const availableRooms = [
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
    distance: "0.8 km",
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
    distance: "1.2 km",
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
    distance: "2.1 km",
    image: gameImage3,
  },
];

export default function Matchmaking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRooms, setFilteredRooms] = useState(availableRooms);
  const [activeFilter, setActiveFilter] = useState<"all" | "hybrid" | "skill">("all");
  const [useMyAvailability, setUseMyAvailability] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a location or venue name");
      return;
    }

    const filtered = availableRooms.filter((room) =>
      room.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredRooms(filtered);
    toast.success(`Found ${filtered.length} ${filtered.length === 1 ? "room" : "rooms"}`);
  };

  const handleFilter = (filter: "all" | "hybrid" | "skill") => {
    setActiveFilter(filter);
    
    let filtered = availableRooms;
    if (filter === "hybrid") {
      filtered = availableRooms.filter((room) => room.isHybrid);
    } else if (filter === "skill") {
      filtered = availableRooms.filter((room) => !room.isHybrid);
    }

    setFilteredRooms(filtered);
    toast.success(`Showing ${filtered.length} ${filtered.length === 1 ? "room" : "rooms"}`);
  };

  const handleQuickJoin = (e: React.MouseEvent, gameId: string, location: string) => {
    e.preventDefault();
    toast.success(`Joined game at ${location}!`);
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
            Join skill-balanced futsal games near you. Play with the right team, every time.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location or venue..."
              className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#39ff14] text-black rounded-lg font-bold hover:bg-[#2de00f] transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Skill Level Indicator */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 uppercase text-xs tracking-wide">Your Skill Level</span>
            <SkillBadge level={USER_SKILL_LEVEL as any} />
            <span className="text-gray-600 text-xs">Showing {USER_SKILL_LEVEL} + Hybrid rooms</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => handleFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeFilter === "all"
                ? "bg-[#39ff14] text-black"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => handleFilter("skill")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeFilter === "skill"
                ? "bg-[#39ff14] text-black"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            {USER_SKILL_LEVEL} Only
          </button>
          <button
            onClick={() => handleFilter("hybrid")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeFilter === "hybrid"
                ? "bg-[#39ff14] text-black"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            Hybrid
          </button>
        </div>

        {/* Use My Availability Filter */}
        <div className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <input
            type="checkbox"
            id="useAvailability"
            checked={useMyAvailability}
            onChange={(e) => setUseMyAvailability(e.target.checked)}
            className="w-4 h-4 rounded border-[#39ff14] text-[#39ff14] focus:ring-[#39ff14] focus:ring-offset-0 bg-[#0a0a0a] cursor-pointer"
          />
          <label htmlFor="useAvailability" className="text-sm text-gray-400 cursor-pointer flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#39ff14]" />
            Use My Availability
          </label>
          {useMyAvailability && (
            <span className="ml-auto text-xs text-[#39ff14]">Filtering by your schedule</span>
          )}
        </div>

        {/* Available Rooms */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Nearby Games
            </h2>
            <span className="text-xs text-gray-500">{filteredRooms.length} available</span>
          </div>

          <div className="space-y-4">
            {filteredRooms.map((game) => (
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
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {game.distance} away
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
                      onClick={(e) => handleQuickJoin(e, game.id, game.location)}
                      className="w-full py-2 bg-[#39ff14] text-black rounded-lg hover:bg-[#2de00f] transition-colors text-sm font-bold"
                    >
                      Join Game
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredRooms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No Games Found</h3>
              <p className="text-gray-500 text-sm mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilteredRooms(availableRooms);
                  setActiveFilter("all");
                }}
                className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg font-bold hover:bg-[#222222] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>

      <Navigation />
    </div>
  );
}
