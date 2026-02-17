/**
 * Game Details Page - Cyberpunk Athleticism
 * Shows single player list with tags, threshold confirmation, and chat (only after joining)
 * Enhanced with modern tag designs and glassmorphism effects
 */

import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Send,
  CheckCircle2,
  Shield,
  Award,
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
    { id: "1", name: "Alex Chen", tags: ["Reliable", "Forward", "Team Player"] },
    { id: "2", name: "Jordan Smith", tags: ["Midfielder", "Punctual"] },
    { id: "3", name: "Sam Rivera", tags: ["Defender", "Good Sport"] },
    { id: "4", name: "Taylor Kim", tags: ["Goalkeeper", "Reliable"] },
    { id: "5", name: "Morgan Lee", tags: ["Forward", "Team Player"] },
    { id: "6", name: "Casey Park", tags: ["Midfielder"] },
    { id: "7", name: "Riley Johnson", tags: ["Defender", "Punctual", "Reliable"] },
  ],
  chat: [
    { id: "1", user: "Alex Chen", message: "Looking forward to this!", time: "2h ago" },
    { id: "2", user: "Jordan Smith", message: "Anyone bringing extra water?", time: "1h ago" },
    { id: "3", user: "Sam Rivera", message: "I got you covered!", time: "45m ago" },
  ],
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

  const getTagConfig = (tag: string) => {
    const configs: Record<string, { icon: any; gradient: string; iconColor: string }> = {
      "Reliable": { icon: Shield, gradient: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-400" },
      "Team Player": { icon: Users, gradient: "from-green-500/20 to-emerald-600/20", iconColor: "text-green-400" },
      "Punctual": { icon: Clock, gradient: "from-purple-500/20 to-purple-600/20", iconColor: "text-purple-400" },
      "Good Sport": { icon: Award, gradient: "from-yellow-500/20 to-yellow-600/20", iconColor: "text-yellow-400" },
      "Forward": { icon: Zap, gradient: "from-red-500/20 to-orange-600/20", iconColor: "text-red-400" },
      "Midfielder": { icon: Target, gradient: "from-cyan-500/20 to-blue-600/20", iconColor: "text-cyan-400" },
      "Defender": { icon: Shield, gradient: "from-indigo-500/20 to-indigo-600/20", iconColor: "text-indigo-400" },
      "Goalkeeper": { icon: Shield, gradient: "from-orange-500/20 to-red-600/20", iconColor: "text-orange-400" },
    };
    return configs[tag] || { icon: Award, gradient: "from-gray-500/20 to-gray-600/20", iconColor: "text-gray-400" };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/">
            <button className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Game Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Game Info Card - Glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/30 bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 backdrop-blur-xl p-5 space-y-4 shadow-[0_8px_32px_rgba(57,255,20,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-[#00d9ff]/5" />
          
          <div className="relative">
            <h2 className="text-xl font-bold text-white mb-1">{game.location}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-[#39ff14]" />
              <span>{game.address}</span>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#39ff14]" />
              <span className="text-gray-300">{game.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#00d9ff]" />
              <span className="text-gray-300">{game.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-[#39ff14]" />
              <span className="text-gray-300">
                {game.playersJoined}/{game.maxPlayers} players
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-[#00d9ff]" />
              <span className="text-gray-300">${game.price} per player</span>
            </div>
          </div>

          <div className="relative">
            <SkillBadge level={game.skillLevel} />
          </div>
        </div>

        {/* Threshold Confirmation */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-3">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#39ff14]/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Confirmation Status</h3>
            <span className="text-xs text-gray-400">
              {game.playersJoined}/{game.maxPlayers} confirmed
            </span>
          </div>

          <Progress value={thresholdPercentage} className="h-2 relative" />

          <div className="relative flex items-center gap-2">
            {isThresholdMet ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
                <span className="text-sm text-[#39ff14] font-semibold">Game confirmed! 80% threshold met</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-semibold">
                  Need {Math.ceil(game.maxPlayers * 0.8) - game.playersJoined} more to confirm
                </span>
              </>
            )}
          </div>
        </div>

        {/* Player List */}
        <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-3">
          <h3 className="text-lg font-bold text-white">Players ({game.playersJoined})</h3>
          
          <div className="space-y-3">
            {game.players.map((player) => (
              <div
                key={player.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a]/80 to-[#0f0f0f]/80 p-4 border border-[#39ff14]/10 hover:border-[#39ff14]/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#39ff14]/0 via-[#39ff14]/5 to-[#00d9ff]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-start gap-3">
                  <Avatar className="w-12 h-12 border-2 border-[#39ff14]/30 group-hover:border-[#39ff14]/50 transition-colors">
                    <AvatarFallback className="bg-gradient-to-br from-[#39ff14]/20 to-[#00d9ff]/20 text-[#39ff14] font-bold">
                      {player.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-2">{player.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {player.tags.map((tag) => {
                        const config = getTagConfig(tag);
                        const Icon = config.icon;
                        return (
                          <div
                            key={tag}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${config.gradient} border border-white/10 backdrop-blur-sm`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                            <span className={`text-xs font-semibold ${config.iconColor}`}>{tag}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section - Only if joined */}
        {isJoined ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 space-y-3">
            <h3 className="text-lg font-bold text-white">Chat</h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-3 bg-[#0a0a0a]/50 rounded-xl border border-[#39ff14]/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#39ff14]">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-[#0a0a0a]/50 border-[#39ff14]/30 text-white placeholder:text-gray-500 focus:border-[#39ff14]"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-transparent" />
            <p className="relative text-center text-gray-400 text-sm">
              Join the game to access chat
            </p>
          </div>
        )}

        {/* Join/Leave Button */}
        <Button
          onClick={handleJoinGame}
          className={`w-full py-6 text-lg font-bold transition-all ${
            isJoined
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : "bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black hover:opacity-90 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
          }`}
        >
          {isJoined ? "Leave Game" : "Join Game"}
        </Button>
      </div>

      <Navigation />
    </div>
  );
}
