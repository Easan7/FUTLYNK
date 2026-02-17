/**
 * Game Details Page - Unique Design
 * Minimal player list with outlined tags, circular progress, clean layout
 */

import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import CircularProgress from "@/components/CircularProgress";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Send,
  Shield,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockGameDetails = {
  id: "1",
  location: "Downtown Sports Arena",
  address: "123 Main Street, Downtown",
  date: "Feb 15, 2026",
  time: "7:00 PM",
  duration: "90 min",
  skillLevel: "Intermediate" as const,
  playersJoined: 7,
  maxPlayers: 10,
  price: 15,
  privacy: "Public",
  players: [
    { id: "1", name: "Alex Chen", tags: ["Reliable", "Forward"] },
    { id: "2", name: "Jordan Smith", tags: ["Midfielder", "Punctual"] },
    { id: "3", name: "Sam Rivera", tags: ["Defender"] },
    { id: "4", name: "Taylor Kim", tags: ["Goalkeeper", "Reliable"] },
    { id: "5", name: "Morgan Lee", tags: ["Forward"] },
    { id: "6", name: "Casey Park", tags: ["Midfielder"] },
    { id: "7", name: "Riley Johnson", tags: ["Defender", "Reliable"] },
  ],
  chat: [
    { id: "1", user: "Alex Chen", message: "Looking forward to this!", time: "2h ago" },
    { id: "2", user: "Jordan Smith", message: "Anyone bringing extra water?", time: "1h ago" },
    { id: "3", user: "Sam Rivera", message: "I got you covered!", time: "45m ago" },
  ],
};

const getTagIcon = (tag: string) => {
  const icons: Record<string, any> = {
    "Reliable": Shield,
    "Forward": Zap,
    "Midfielder": Users,
    "Defender": Shield,
    "Goalkeeper": Target,
    "Punctual": Clock,
  };
  return icons[tag] || Users;
};

export default function GameDetails() {
  const [, params] = useRoute("/game/:id");
  const game = mockGameDetails;
  
  const [message, setMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [chatMessages, setChatMessages] = useState(game.chat);

  const thresholdPercentage = (game.playersJoined / game.maxPlayers) * 100;
  const isThresholdMet = thresholdPercentage >= 80;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setChatMessages([...chatMessages, {
      id: String(chatMessages.length + 1),
      user: "You",
      message: message,
      time: "Just now"
    }]);
    setMessage("");
    toast.success("Message sent!");
  };

  const handleJoinGame = () => {
    if (isJoined) {
      setIsJoined(false);
      toast.info("You left the game");
    } else {
      setIsJoined(true);
      toast.success("You joined the game!");
    }
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
            <h1 className="text-lg font-bold text-white">{game.location}</h1>
            <p className="text-xs text-gray-500">{game.address}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Game Info - Large numbers style */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">Date & Time</p>
              <p className="text-white font-bold">{game.date}</p>
              <p className="text-gray-400 text-sm">{game.time}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">Duration</p>
              <p className="text-white font-bold text-2xl">{game.duration}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">Skill Level</p>
              <SkillBadge level={game.skillLevel} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-1">Price</p>
              <p className="text-[#39ff14] font-bold text-2xl">${game.price}</p>
            </div>
          </div>
        </div>

        {/* Threshold Progress - Minimal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-gray-500 tracking-wide">Confirmation Status</p>
            <p className="text-sm font-bold text-white">{Math.round(thresholdPercentage)}%</p>
          </div>
          <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isThresholdMet ? "bg-[#39ff14]" : "bg-gray-600"
              }`}
              style={{ width: `${thresholdPercentage}%` }}
            />
          </div>
          {isThresholdMet && (
            <p className="text-xs text-[#39ff14]">✓ Game confirmed</p>
          )}
        </div>

        {/* Players - Clean list with outlined tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Players</h2>
            <CircularProgress
              value={game.playersJoined}
              max={game.maxPlayers}
              size={48}
              strokeWidth={4}
              color="#39ff14"
            />
          </div>

          <div className="space-y-2">
            {game.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
              >
                <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                  <AvatarFallback className="bg-[#0f0f0f] text-white text-sm font-bold">
                    {player.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{player.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {player.tags.map((tag) => {
                      const Icon = getTagIcon(tag);
                      return (
                        <div
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 border border-gray-700 rounded-full"
                        >
                          <Icon className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-400">{tag}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat - Only if joined */}
        {isJoined && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">Chat</h2>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-3 bg-[#1a1a1a]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium text-sm">{msg.user}</p>
                    <p className="text-[10px] text-gray-500">{msg.time}</p>
                  </div>
                  <p className="text-gray-400 text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#39ff14] text-black rounded-lg hover:bg-[#2de00f] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={handleJoinGame}
          className={`w-full py-4 font-bold rounded-lg transition-colors ${
            isJoined
              ? "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
              : "bg-[#39ff14] text-black hover:bg-[#2de00f]"
          }`}
        >
          {isJoined ? "Leave Game" : "Join Game"}
        </button>
      </div>

      <Navigation />
    </div>
  );
}
