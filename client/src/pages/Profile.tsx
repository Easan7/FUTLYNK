/*
 * Profile Page - Cyberpunk Athleticism
 * Player stats, match history, badges, and achievements
 */

import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle2,
  Settings,
} from "lucide-react";

// Mock data
const mockProfile = {
  name: "Alex Chen",
  rating: 1850,
  skillLevel: "Intermediate" as const,
  position: "Forward",
  gamesPlayed: 47,
  winRate: 68,
  attendanceRate: 95,
  goalsScored: 23,
  assists: 15,
  badges: [
    { id: "1", name: "Top Scorer", icon: Trophy, color: "text-neon-green" },
    { id: "2", name: "Reliable Player", icon: CheckCircle2, color: "text-neon-cyan" },
    { id: "3", name: "Team Player", icon: Award, color: "text-primary" },
  ],
  recentMatches: [
    { id: "1", date: "Feb 10, 2026", venue: "Downtown Arena", result: "Win", score: "5-3" },
    { id: "2", date: "Feb 8, 2026", venue: "Eastside Court", result: "Win", score: "4-2" },
    { id: "3", date: "Feb 5, 2026", venue: "Metro Complex", result: "Loss", score: "2-4" },
    { id: "4", date: "Feb 3, 2026", venue: "Westgate Sports", result: "Win", score: "6-4" },
    { id: "5", date: "Jan 30, 2026", venue: "Riverside Hub", result: "Win", score: "3-2" },
  ],
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-foreground">Profile</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div
        className="relative h-32 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-4_1770793033000_na1fn_YWJzdHJhY3QtZnV0c2FsLXBhdHRlcm4.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTRfMTc3MDc5MzAzMzAwMF9uYTFmbl9ZV0p6ZEhKaFkzUXRablYwYzJGc0xYQmhkSFJsY200LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XOliaOge9fDWATWaUTmsWTSFjRo1qoDWKJwOfRS69iEkLMQMZZtp3yxZYs0XCPonV-6Vczyx0I26~f7lxz1~rOOMuExFgcT6dEVUuzKm-fM8ygFXMrygmFIyVWULZ352L7ygq1htnL6YG5uCf3J1CPf4E-oWBCdjEk91HmjO7KW97KuzVF80DRIHxoG5-H9wlYvo~LRyiuXZblW~e3KssHPQD~nSVDWC1HBcRZrpo67f4fdEaATzXZkn47y9XVSmme5Ljh-iA950IZPxw7uXCb9nsSrqTyLs2YCUZCOFheorQvtCUff3k-Je3Xu5MGakm8PD-ToHwE1X1yh5WUUTSg__')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container -mt-16 relative z-10 space-y-6 pb-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-end gap-4">
          <Avatar className="w-24 h-24 border-4 border-neon-green shadow-lg shadow-neon-green/30">
            <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-cyan text-background text-3xl font-display font-bold">
              AC
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-2">
            <h2 className="text-2xl font-display font-bold text-foreground">{mockProfile.name}</h2>
            <p className="text-sm text-muted-foreground">{mockProfile.position}</p>
          </div>
        </div>

        {/* Rating & Skill */}
        <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Player Rating</div>
              <div className="text-4xl font-display font-bold text-neon-green font-accent">
                {mockProfile.rating}
              </div>
            </div>
            <SkillBadge level={mockProfile.skillLevel} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center space-y-1">
              <div className="text-2xl font-display font-bold text-foreground">
                {mockProfile.gamesPlayed}
              </div>
              <div className="text-xs text-muted-foreground">Games</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-display font-bold text-neon-green">
                {mockProfile.winRate}%
              </div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-display font-bold text-neon-cyan">
                {mockProfile.attendanceRate}%
              </div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border-2 border-neon-green/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-neon-green" />
              <span className="text-sm font-semibold text-muted-foreground">Goals</span>
            </div>
            <div className="text-3xl font-display font-bold text-neon-green font-accent">
              {mockProfile.goalsScored}
            </div>
          </div>

          <div className="bg-card border-2 border-neon-cyan/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-cyan" />
              <span className="text-sm font-semibold text-muted-foreground">Assists</span>
            </div>
            <div className="text-3xl font-display font-bold text-neon-cyan font-accent">
              {mockProfile.assists}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-display font-bold text-foreground">Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            {mockProfile.badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center ${badge.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-center text-foreground">
                    {badge.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Match History */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full bg-muted">
            <TabsTrigger value="history" className="flex-1 font-display font-semibold">
              <Calendar className="w-4 h-4 mr-2" />
              Match History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3 mt-4">
            {mockProfile.recentMatches.map((match) => (
              <div
                key={match.id}
                className="bg-card border-2 border-border rounded-xl p-4 hover:border-neon-green/30 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{match.venue}</div>
                    <div className="text-xs text-muted-foreground">{match.date}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-accent ${
                        match.result === "Win" ? "text-neon-green" : "text-muted-foreground"
                      }`}
                    >
                      {match.result}
                    </div>
                    <div className="text-xs text-muted-foreground">{match.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
}
