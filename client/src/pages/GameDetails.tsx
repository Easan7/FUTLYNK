/**
 * Game Details Page - Cyberpunk Athleticism
 * Shows single player list with tags, threshold confirmation, and chat (only after joining)
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

  const getTagColor = (tag: string) => {
    const tagColors: Record<string, string> = {
      "Reliable": "bg-blue-500/20 text-blue-400 border-blue-500/50",
      "Team Player": "bg-green-500/20 text-green-400 border-green-500/50",
      "Punctual": "bg-purple-500/20 text-purple-400 border-purple-500/50",
      "Good Sport": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      "Forward": "bg-red-500/20 text-red-400 border-red-500/50",
      "Midfielder": "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
      "Defender": "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
      "Goalkeeper": "bg-orange-500/20 text-orange-400 border-orange-500/50",
    };
    return tagColors[tag] || "bg-gray-500/20 text-gray-400 border-gray-500/50";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#39ff14]/20 p-4">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/">
            <button className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Game Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Game Info Card */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{game.location}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{game.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <SkillBadge level={game.skillLevel} />
        </Card>

        {/* Threshold Confirmation */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Confirmation Status</h3>
            <span className="text-xs text-gray-400">
              {game.playersJoined}/{game.maxPlayers} confirmed
            </span>
          </div>

          <Progress value={thresholdPercentage} className="h-2" />

          <div className="flex items-center gap-2">
            {isThresholdMet ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
                <span className="text-sm text-[#39ff14]">Game confirmed! 80% threshold met</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">
                  Need {Math.ceil(game.maxPlayers * 0.8) - game.playersJoined} more to confirm
                </span>
              </>
            )}
          </div>
        </Card>

        {/* Player List */}
        <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
          <h3 className="text-lg font-semibold text-white">Players ({game.playersJoined})</h3>
          
          <div className="space-y-2">
            {game.players.map((player) => (
              <div
                key={player.id}
                className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg"
              >
                <Avatar className="w-10 h-10 border-2 border-[#39ff14]/30">
                  <AvatarFallback className="bg-[#39ff14]/10 text-[#39ff14] font-semibold">
                    {player.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{player.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {player.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className={`text-xs ${getTagColor(tag)}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Section - Only if joined */}
        {isJoined ? (
          <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4 space-y-3">
            <h3 className="text-lg font-semibold text-white">Chat</h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2 bg-[#0f0f0f] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#39ff14]">{msg.user}</span>
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
                className="bg-[#0f0f0f] border-[#39ff14]/30 text-white"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-[#1a1a1a] border-[#39ff14]/20 p-4">
            <p className="text-center text-gray-400 text-sm">
              Join the game to access chat
            </p>
          </Card>
        )}

        {/* Join/Leave Button */}
        <Button
          onClick={handleJoinGame}
          className={`w-full py-6 text-lg font-semibold ${
            isJoined
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gradient-to-r from-[#39ff14] to-[#00d9ff] text-black hover:opacity-90"
          }`}
        >
          {isJoined ? "Leave Game" : "Join Game"}
        </Button>
      </div>

      <Navigation />
    </div>
  );
}
