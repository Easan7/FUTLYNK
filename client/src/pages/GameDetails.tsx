/*
 * Game Details Page - Cyberpunk Athleticism
 * Full game information with player list, team balancing, and chat
 */

import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Send,
  Shield,
  Zap,
} from "lucide-react";

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
  teamBalancing: true,
  players: [
    { id: "1", name: "Alex Chen", rating: 1850, position: "Forward", team: "A" },
    { id: "2", name: "Jordan Smith", rating: 1720, position: "Midfielder", team: "A" },
    { id: "3", name: "Sam Rivera", rating: 1680, position: "Defender", team: "B" },
    { id: "4", name: "Taylor Kim", rating: 1790, position: "Goalkeeper", team: "B" },
    { id: "5", name: "Morgan Lee", rating: 1650, position: "Forward", team: "A" },
    { id: "6", name: "Casey Park", rating: 1710, position: "Midfielder", team: "B" },
    { id: "7", name: "Riley Johnson", rating: 1820, position: "Defender", team: "A" },
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
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: String(chatMessages.length + 1),
        user: "You",
        message: message,
        time: "Just now"
      }]);
      setMessage("");
    }
  };
  const teamA = game.players.filter((p) => p.team === "A");
  const teamB = game.players.filter((p) => p.team === "B");

  const handleJoinGame = () => {
    setIsJoined(!isJoined);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-display font-bold text-foreground">
              Game Details
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-3_1770793030000_na1fn_dGVhbS1odWRkbGUtZ2xvdw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTNfMTc3MDc5MzAzMDAwMF9uYTFmbl9kR1ZoYlMxb2RXUmtiR1V0WjJ4dmR3LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=nzofDeBu5oaOn-vpMIjPRxMgI7QDvKOnbUaWHxjH~8rUuEHWqMc5Aza-u3up8kh98McBGJ6ZRtThfjK6Kiya3xaGQ0Rq~JNS0PX9qJLRG1HvmKNA~Zq9WJtccwWPJkOWmXtjDjh~ZbizCw0FIfCwQbBLIn-~ifY7ehULqi5KsYhw5T9fO36CkEbBQE9~eDOXHQ9-pHQGM80Usqj8Fg6Wx~-SwJpw~ydf4lA6ZBmN6vHPUoaqUID-twRiuWx2TJ6F6JadT0W33lpbwvN-nHlyBJ1xRRGj~Jm68FPTEf9uKEemFAuY8ntFl8-QKgg66~NUyi9XIBTSbNDatZpwOAatg__')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container py-6 space-y-6">
        {/* Game Info Card */}
        <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-6">
          {/* Location & Skill */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {game.location}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm">{game.address}</span>
                </div>
              </div>
              <SkillBadge level={game.skillLevel} />
            </div>
          </div>

          {/* Date, Time, Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <Calendar className="w-5 h-5 text-neon-green" />
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="text-sm font-semibold text-foreground">{game.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <Clock className="w-5 h-5 text-neon-cyan" />
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="text-sm font-semibold text-foreground">{game.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <Users className="w-5 h-5 text-neon-green" />
              <div>
                <div className="text-xs text-muted-foreground">Players</div>
                <div className="text-sm font-semibold text-foreground font-accent">
                  {game.playersJoined}/{game.maxPlayers}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <DollarSign className="w-5 h-5 text-neon-cyan" />
              <div>
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="text-sm font-semibold text-foreground">${game.price}</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 flex-wrap">
            {game.teamBalancing && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg">
                <Zap className="w-4 h-4 text-neon-green" />
                <span className="text-xs font-semibold text-neon-green">Auto-Balanced Teams</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded-lg">
              <Shield className="w-4 h-4 text-neon-cyan" />
              <span className="text-xs font-semibold text-neon-cyan">{game.privacy}</span>
            </div>
          </div>

          {/* Threshold Progress */}
          <div className="bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Confirmation Threshold</span>
              <span className="text-sm font-bold text-neon-green">{Math.round(thresholdPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isThresholdMet
                    ? "bg-gradient-to-r from-neon-green to-neon-cyan"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
                style={{ width: `${thresholdPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isThresholdMet
                ? "✓ Game confirmed! Payment will be collected."
                : `Need ${Math.ceil(game.maxPlayers * 0.8) - game.playersJoined} more players to confirm`}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/20 rounded-xl p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Game starts in</div>
            <div className="text-3xl font-display font-bold text-neon-green font-accent">
              2d 14h 32m
            </div>
          </div>
        </div>

        {/* Tabs: Players & Chat */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-muted">
            <TabsTrigger value="players" className="font-display font-semibold">
              Players & Teams
            </TabsTrigger>
            <TabsTrigger value="chat" className="font-display font-semibold">
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-4 mt-4">
            {/* Team Balancing Preview */}
            <div className="grid grid-cols-2 gap-4">
              {/* Team A */}
              <div className="bg-card border-2 border-neon-green/30 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-display font-bold text-neon-green flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-green rounded-full" />
                  Team A
                </h3>
                <div className="space-y-2">
                  {teamA.map((player) => (
                    <div key={player.id} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 border-2 border-neon-green/50">
                        <AvatarFallback className="bg-neon-green/20 text-neon-green text-xs font-bold">
                          {player.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {player.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-accent">
                          {player.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team B */}
              <div className="bg-card border-2 border-neon-cyan/30 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-display font-bold text-neon-cyan flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-cyan rounded-full" />
                  Team B
                </h3>
                <div className="space-y-2">
                  {teamB.map((player) => (
                    <div key={player.id} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 border-2 border-neon-cyan/50">
                        <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs font-bold">
                          {player.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {player.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-accent">
                          {player.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="bg-card border-2 border-border rounded-xl p-4 space-y-4 h-[300px] overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neon-green">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-muted border-border"
              />
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Join/Leave Button */}
        <Button
          className={`w-full py-6 font-display font-bold text-lg transition-all duration-300 ${
            isJoined
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-neon-green/30"
          }`}
          onClick={handleJoinGame}
        >
          {isJoined ? "Leave Game" : "Join Game - $15"}
        </Button>
      </div>

      <Navigation />
    </div>
  );
}
