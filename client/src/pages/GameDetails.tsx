/**
 * Game Details Page - Unique Design
 * Minimal player list with outlined tags, circular progress, clean layout
 * Shows chat for joined games, hides skill badges in non-hybrid rooms
 */

import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, PaperPlaneTilt } from "@phosphor-icons/react";
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

export default function GameDetails() {
  const [, params] = useRoute("/game/:id");
  const gameId = params?.id || "1";
  const game = mockGames[gameId] || mockGames["1"];
  
  // Check if coming from matchmaking (not joined yet)
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("source");
  const isFromMatchmaking = source === "matchmaking";
  
  const [message, setMessage] = useState("");
  const [isJoined, setIsJoined] = useState(isFromMatchmaking ? false : (game.userJoined || false));
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
      {/* Hero Panel */}
      <div className="relative bg-[#0d0d0d] border-b border-[#1a1a1a] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 36px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 36px)`,
          }}
        />
        <div className="relative p-4 pt-5 pb-7">
          <div className="flex items-start justify-between mb-8">
            <Link href="/">
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={16} />
                <span className="text-sm">Back</span>
              </button>
            </Link>
            <div
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                isThresholdMet
                  ? "bg-[#39ff14] text-black"
                  : "bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400"
              }`}
            >
              {isThresholdMet ? "Confirmed" : "Open"}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-1">{game.location}</h1>
          <p className="text-sm text-gray-500">{game.date}&nbsp;·&nbsp;{game.time}</p>
        </div>
      </div>

      <div className="p-4 space-y-7">
        {/* Info grid */}
        <div className="grid grid-cols-2 border border-[#1a1a1a] divide-x divide-y divide-[#1a1a1a]">
          <div className="p-3 space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-gray-600">Address</p>
            <p className="text-sm text-white font-medium">{game.address}</p>
          </div>
          <div className="p-3 space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-gray-600">Duration</p>
            <p className="text-sm text-white font-medium">{game.duration}</p>
          </div>
          <div className="p-3 space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-gray-600">Price</p>
            <p className="text-sm text-white font-medium">${game.price} / player</p>
          </div>
          <div className="p-3">
            <p className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">Format</p>
            {game.isHybrid ? (
              <SkillBadge level="Hybrid" colored />
            ) : (
              <SkillBadge level={game.skillLevel} colored />
            )}
          </div>
        </div>

        {/* Squad */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
            <span className="w-[3px] h-4 bg-[#39ff14] rounded-full" />
            Squad
          </h2>
          <div className="flex items-end gap-5">
            <div>
              <span className="text-5xl font-bold text-white tabular-nums">
                {String(game.playersJoined).padStart(2, "0")}
              </span>
              <span className="text-xl font-bold text-gray-600"> / {game.maxPlayers}</span>
            </div>
            <div className="pb-1.5 flex-1 space-y-1.5">
              <div className="flex gap-1">
                {Array.from({ length: game.maxPlayers }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-sm ${
                      i < game.playersJoined ? "bg-[#39ff14]" : "bg-[#1a1a1a]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-600">
                {isThresholdMet
                  ? "✓ Minimum reached — game is on"
                  : `${Math.ceil(game.maxPlayers * 0.8) - game.playersJoined} more to confirm`}
              </p>
            </div>
          </div>
        </div>

        {/* Player roster */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
            <span className="w-[3px] h-4 bg-[#39ff14] rounded-full" />
            Players ({game.playersJoined}/{game.maxPlayers})
          </h2>
          <div className="border border-[#1a1a1a] divide-y divide-[#1a1a1a]">
            {game.players.map((player: any, idx: number) => {
              const skillColors: Record<string, string> = {
                Beginner: "bg-emerald-600",
                Intermediate: "bg-amber-500",
                Advanced: "bg-rose-600",
              };
              const dotColor = skillColors[player.skillLevel] || "bg-gray-600";
              return (
                <div key={player.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#111] transition-colors">
                  <span className="text-[10px] text-gray-700 w-5 text-right tabular-nums">{idx + 1}</span>
                  <div className={`w-1 h-6 rounded-sm flex-shrink-0 ${dotColor}`} />
                  <Avatar className="w-8 h-8 border border-[#2a2a2a]">
                    <AvatarFallback className="bg-[#0f0f0f] text-white text-[10px] font-bold">
                      {player.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">{player.name}</p>
                      {game.isHybrid && player.skillLevel && (
                        <SkillBadge level={player.skillLevel} colored />
                      )}
                    </div>
                    {player.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {player.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[9px] uppercase tracking-wide font-bold bg-[#1a1a1a] text-gray-500 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat */}
        {isJoined && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
              <span className="w-[3px] h-4 bg-[#39ff14] rounded-full" />
              Chat
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatMessages.map((msg: any) => {
                const isMe = msg.user === "You";
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-sm text-sm ${
                        isMe ? "bg-[#39ff14] text-black" : "bg-[#1a1a1a] text-gray-300"
                      }`}
                    >
                      {!isMe && (
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{msg.user}</p>
                      )}
                      <p>{msg.message}</p>
                      <p className={`text-[9px] mt-0.5 ${isMe ? "text-black/50" : "text-gray-600"}`}>{msg.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Message..."
                className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white rounded-sm"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 bg-[#39ff14] text-black rounded-sm hover:bg-[#2de00f] transition-colors"
              >
                <PaperPlaneTilt size={16} weight="fill" />
              </button>
            </div>
          </div>
        )}

        {/* Action */}
        {!isJoined ? (
          <button
            onClick={handleJoinGame}
            className="w-full py-4 font-bold text-sm uppercase tracking-widest rounded-sm transition-colors bg-[#39ff14] text-black hover:bg-[#2de00f]"
          >
            Join Game
          </button>
        ) : (
          <button
            onClick={handleJoinGame}
            className="w-full py-4 font-bold text-sm uppercase tracking-widest rounded-sm transition-colors bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:bg-[#222222]"
          >
            Leave Game
          </button>
        )}
      </div>

      <Navigation />
    </div>
  );
}
