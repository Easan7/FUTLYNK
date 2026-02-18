/**
 * Game Details Page - Unique Design
 * Minimal player list with outlined tags, circular progress, clean layout
 * Shows chat for joined games, hides skill badges in non-hybrid rooms
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

// Mock data - Game 1 is Intermediate only (user joined), Game 2 is Hybrid (user joined)
const mockGames: Record<string, any> = {
  "1": {
    id: "1",
    location: "Downtown Sports Arena",
    address: "123 Main Street, Downtown",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    duration: "90 min",
    skillLevel: "Intermediate",
    isHybrid: false,
    playersJoined: 7,
    maxPlayers: 10,
    price: 15,
    privacy: "Public",
    userJoined: true, // User has joined this game
    players: [
      { id: "1", name: "Alex Chen", skillLevel: "Intermediate" as const, tags: ["Reliable", "Forward"] },
      { id: "2", name: "Jordan Smith", skillLevel: "Intermediate" as const, tags: ["Midfielder", "Punctual"] },
      { id: "3", name: "Sam Rivera", skillLevel: "Intermediate" as const, tags: ["Defender"] },
      { id: "4", name: "Taylor Kim", skillLevel: "Intermediate" as const, tags: ["Goalkeeper", "Reliable"] },
      { id: "5", name: "Morgan Lee", skillLevel: "Intermediate" as const, tags: ["Forward"] },
      { id: "6", name: "Casey Park", skillLevel: "Intermediate" as const, tags: ["Midfielder"] },
      { id: "7", name: "Riley Johnson", skillLevel: "Intermediate" as const, tags: ["Defender", "Reliable"] },
    ],
    chat: [
      { id: "1", user: "Alex Chen", message: "Looking forward to this!", time: "2h ago" },
      { id: "2", user: "Jordan Smith", message: "Anyone bringing extra water?", time: "1h ago" },
      { id: "3", user: "Sam Rivera", message: "I got you covered!", time: "45m ago" },
    ],
  },
  "2": {
    id: "2",
    location: "Metro Futsal Complex",
    address: "456 Metro Avenue",
    date: "Feb 17, 2026",
    time: "8:00 PM",
    duration: "90 min",
    skillLevel: null,
    isHybrid: true,
    playersJoined: 6,
    maxPlayers: 10,
    price: 18,
    privacy: "Public",
    userJoined: true, // User has joined this game
    players: [
      { id: "1", name: "Alex Chen", skillLevel: "Intermediate" as const, tags: ["Reliable", "Forward"] },
      { id: "2", name: "Jordan Smith", skillLevel: "Advanced" as const, tags: ["Midfielder", "Punctual"] },
      { id: "3", name: "Sam Rivera", skillLevel: "Intermediate" as const, tags: ["Defender"] },
      { id: "4", name: "Taylor Kim", skillLevel: "Beginner" as const, tags: ["Goalkeeper", "Reliable"] },
      { id: "5", name: "Morgan Lee", skillLevel: "Advanced" as const, tags: ["Forward"] },
      { id: "6", name: "Casey Park", skillLevel: "Intermediate" as const, tags: ["Midfielder"] },
    ],
    chat: [
      { id: "1", user: "Alex Chen", message: "See you there!", time: "3h ago" },
      { id: "2", user: "Jordan Smith", message: "Can't wait!", time: "2h ago" },
    ],
  },
  "3": {
    id: "3",
    location: "Westgate Indoor Sports",
    address: "789 West Road",
    date: "Feb 18, 2026",
    time: "7:30 PM",
    duration: "90 min",
    skillLevel: "Intermediate",
    isHybrid: false,
    playersJoined: 5,
    maxPlayers: 10,
    price: 15,
    privacy: "Public",
    userJoined: false, // User has NOT joined
    players: [
      { id: "1", name: "Chris Wong", skillLevel: "Intermediate" as const, tags: ["Forward"] },
      { id: "2", name: "Pat Lee", skillLevel: "Intermediate" as const, tags: ["Midfielder"] },
      { id: "3", name: "Jamie Tan", skillLevel: "Intermediate" as const, tags: ["Defender", "Reliable"] },
      { id: "4", name: "Drew Kim", skillLevel: "Intermediate" as const, tags: ["Goalkeeper"] },
      { id: "5", name: "Avery Chen", skillLevel: "Intermediate" as const, tags: ["Forward", "Punctual"] },
    ],
    chat: [],
  },
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
  const gameId = params?.id || "1";
  const game = mockGames[gameId] || mockGames["1"];
  
  const [message, setMessage] = useState("");
  const [isJoined, setIsJoined] = useState(game.userJoined || false);
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
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] p-4">
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </Link>
      </div>

      <div className="p-4 space-y-6">
        {/* Game Info - Minimal */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{game.location}</h1>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{game.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{game.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{game.time} • {game.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-bold">${game.price} per player</span>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <CircularProgress
              value={game.playersJoined}
              max={game.maxPlayers}
              size={80}
              strokeWidth={6}
            />
          </div>

          {/* Skill Level Badge */}
          <div className="flex items-center gap-3">
            {game.isHybrid ? (
              <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-sm text-cyan-400 font-bold uppercase">
                HYBRID • No Restrictions
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Skill Level</span>
                <SkillBadge level={game.skillLevel} />
              </div>
            )}
          </div>

          {/* Threshold Confirmation Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 uppercase tracking-wide">Game Confirmation</span>
              <span className={`font-bold ${isThresholdMet ? "text-[#39ff14]" : "text-gray-500"}`}>
                {Math.round(thresholdPercentage)}% confirmed
              </span>
            </div>
            <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isThresholdMet ? "bg-[#39ff14]" : "bg-gray-700"
                }`}
                style={{ width: `${thresholdPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-600">
              {isThresholdMet
                ? "✓ Game confirmed! Minimum players reached."
                : `Need ${Math.ceil(game.maxPlayers * 0.8) - game.playersJoined} more ${
                    Math.ceil(game.maxPlayers * 0.8) - game.playersJoined === 1 ? "player" : "players"
                  } to confirm.`}
            </p>
          </div>
        </div>

        {/* Player List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Players ({game.playersJoined}/{game.maxPlayers})
            </h2>
          </div>

          <div className="space-y-2">
            {game.players.map((player: any) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
              >
                <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                  <AvatarFallback className="bg-[#0f0f0f] text-white text-sm font-bold">
                    {player.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{player.name}</p>
                    {/* Only show skill badge in hybrid rooms */}
                    {game.isHybrid && player.skillLevel && (
                      <SkillBadge level={player.skillLevel} />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {player.tags.map((tag: string) => {
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

        {/* Chat - Show for joined games */}
        {isJoined && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Chat</h2>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatMessages.map((msg: any) => (
                <div key={msg.id} className="p-3 bg-[#1a1a1a] rounded-lg">
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

        {/* Join/Leave Button */}
        {!isJoined && (
          <button
            onClick={handleJoinGame}
            className="w-full py-4 font-bold rounded-lg transition-colors bg-[#39ff14] text-black hover:bg-[#2de00f]"
          >
            Join Game
          </button>
        )}
        
        {isJoined && (
          <button
            onClick={handleJoinGame}
            className="w-full py-4 font-bold rounded-lg transition-colors bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:bg-[#222222]"
          >
            Leave Game
          </button>
        )}
      </div>

      <Navigation />
    </div>
  );
}
