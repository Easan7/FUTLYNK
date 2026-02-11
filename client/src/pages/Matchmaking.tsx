/*
 * Matchmaking Screen - Cyberpunk Athleticism
 * AI-powered game finder with loading animation and suggested matches
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import GameCard, { Game } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

// Mock suggested games
const mockSuggestedGames: Game[] = [
  {
    id: "1",
    location: "Downtown Sports Arena",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    skillLevel: "Intermediate",
    playersJoined: 7,
    maxPlayers: 10,
    price: 15,
  },
  {
    id: "2",
    location: "Westgate Indoor Sports",
    date: "Feb 18, 2026",
    time: "7:30 PM",
    skillLevel: "Intermediate",
    playersJoined: 5,
    maxPlayers: 10,
    price: 15,
  },
  {
    id: "3",
    location: "Metro Futsal Complex",
    date: "Feb 17, 2026",
    time: "8:00 PM",
    skillLevel: "Advanced",
    playersJoined: 9,
    maxPlayers: 10,
    price: 20,
  },
];

export default function Matchmaking() {
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFindMatch = () => {
    setIsSearching(true);
    setShowResults(false);

    // Simulate AI matching process
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-xl font-display font-bold text-foreground">AI Matchmaking</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative h-56 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-2_1770793029000_na1fn_cGxheWVyLWFjdGlvbi1uZW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTJfMTc3MDc5MzAyOTAwMF9uYTFmbl9jR3hoZVdWeUxXRmpkR2x2YmkxdVpXOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=DuEiyNd7EXXXL27n0byVp1zdxZr23ZoRTTL9fm9MRjWmae5LLSwHBNFjTPww0Fz3ep2mKB7rCpwJsjK5BWCQubHstCNYHuE1ZYuMlmFyyuYq4Bk~sCW~-uzqoJIzjA1F2p3lgt4UzHVf9oU7fUF6FsR16DyVJLGQNn90G0q311Js6qyUJlO86VJCzDBXykxOvSD44WiV6K2jjjtbSp5cksVXaPvUm3xVYsxQK1aMbcLwGZ~yrK~153etpYwIG3qVtHM2q66nc6FDNvUYJvcEOrpnj5XlUF1duqdhGREbd56xKr8V21uwR7Lgd4D-hjeGKbHfrYIDakCTfzpydBUWPw__')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        
        <div className="relative container h-full flex flex-col justify-end pb-8">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
              Find Your
              <br />
              <span className="text-neon-cyan drop-shadow-[0_0_20px_rgba(0,217,255,0.6)]">
                Perfect Game
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-md">
              Let AI find the best match based on your skill, location, and schedule
            </p>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {!isSearching && !showResults && (
          <div className="space-y-6">
            {/* AI Match Button */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-background" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  AI-Powered Matching
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Our smart algorithm analyzes your profile, skill level, and preferences to find the perfect game for you
                </p>
              </div>

              <Button
                onClick={handleFindMatch}
                className="w-full max-w-sm py-6 bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90 text-background font-display font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/30"
              >
                <Zap className="w-5 h-5 mr-2" />
                Find Me a Game
              </Button>
            </div>

            {/* How it Works */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-display font-bold text-foreground">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-neon-green font-accent">1</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Analyze Your Profile</div>
                    <div className="text-xs text-muted-foreground">We check your skill rating, position, and past performance</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-neon-cyan font-accent">2</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Find Compatible Games</div>
                    <div className="text-xs text-muted-foreground">Match you with games at your skill level nearby</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-neon-green font-accent">3</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Balance Teams</div>
                    <div className="text-xs text-muted-foreground">Ensure fair, competitive matches for everyone</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSearching && (
          <div className="flex flex-col items-center justify-center py-16 space-y-8">
            {/* Animated Loading Rings */}
            <div className="relative w-32 h-32">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-neon-green/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neon-green animate-spin" />
              
              {/* Middle ring */}
              <div className="absolute inset-3 rounded-full border-4 border-neon-cyan/20" />
              <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-neon-cyan animate-spin animation-delay-150" style={{ animationDuration: '1.5s' }} />
              
              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-neon-green animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-display font-bold text-foreground">
                Finding Your Match
              </h3>
              <p className="text-sm text-muted-foreground animate-pulse">
                Analyzing nearby games and skill compatibility...
              </p>
            </div>

            {/* Progress Steps */}
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-muted-foreground">Checking your profile...</span>
              </div>
              <div className="flex items-center gap-3 text-sm animation-delay-300">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-muted-foreground">Scanning nearby games...</span>
              </div>
              <div className="flex items-center gap-3 text-sm animation-delay-600">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Calculating best matches...</span>
              </div>
            </div>
          </div>
        )}

        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  Suggested Games
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your profile and preferences
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setIsSearching(false);
                }}
                className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
              >
                Search Again
              </Button>
            </div>

            <div className="grid gap-4">
              {mockSuggestedGames.map((game, index) => (
                <div
                  key={game.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
