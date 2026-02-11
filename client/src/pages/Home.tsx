/*
 * Home / Discover Games Page - Cyberpunk Athleticism
 * Mobile-first layout with filter bar, game cards, and map toggle
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import GameCard, { Game } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Filter, MapIcon, Grid3x3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockGames: Game[] = [
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
    location: "Eastside Futsal Court",
    date: "Feb 16, 2026",
    time: "6:30 PM",
    skillLevel: "Beginner",
    playersJoined: 4,
    maxPlayers: 8,
    price: 12,
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
  {
    id: "4",
    location: "Westgate Indoor Sports",
    date: "Feb 18, 2026",
    time: "7:30 PM",
    skillLevel: "Intermediate",
    playersJoined: 5,
    maxPlayers: 10,
    price: 15,
  },
  {
    id: "5",
    location: "Riverside Futsal Hub",
    date: "Feb 19, 2026",
    time: "6:00 PM",
    skillLevel: "Beginner",
    playersJoined: 3,
    maxPlayers: 8,
    price: 10,
  },
];

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [distanceFilter, setDistanceFilter] = useState<string>("all");

  const filteredGames = mockGames.filter((game) => {
    if (skillFilter !== "all" && game.skillLevel !== skillFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-1_1770793031000_na1fn_aGVyby1mdXRzYWwtbmlnaHQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTFfMTc3MDc5MzAzMTAwMF9uYTFmbl9hR1Z5YnkxbWRYUnpZV3d0Ym1sbmFIUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LG9p9QP6hgh4CX9F9HUXjISWqMMXVyPyUsz7lXLNafhxEITqyM92ICeBNezhOm2QeZPll7wmVKL481pn4KZe-pTWjrZ3mTEJDfCFI4K4fdHuFvUETLOS9bFldEyF1e6ClN1p7Fpl63U1vT0BwvcosUvi67vdQXHjiaVb4wbgPbJzI43fuLC-OjWl~Awci3lvzVMMn9ZM2DSnm-MUNouPJh9qamgWn3Dt~DJNI8C~t6YfXuIn~hj2FN108f7CurvA~B88lUNsjNF708fRk8wr~R0TXo89tGCkcoiYbv~ehhy~Dpa8kpgPXDbIxWe2dtfbvDF7XP5DJILAMpWX0-0mug__')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Content */}
        <div className="relative container pt-8 pb-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Find Your
              <br />
              <span className="text-neon-green drop-shadow-[0_0_20px_rgba(57,255,20,0.6)]">
                Perfect Match
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join skill-balanced futsal games near you. Play with the right team, every time.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-lg">
        <div className="container py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {/* Skill Level Filter */}
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-[140px] border-neon-green/30 bg-background">
                <Filter className="w-4 h-4 mr-2 text-neon-green" />
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Distance Filter */}
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="w-[130px] border-neon-cyan/30 bg-background">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Distance</SelectItem>
                <SelectItem value="1">Within 1 km</SelectItem>
                <SelectItem value="5">Within 5 km</SelectItem>
                <SelectItem value="10">Within 10 km</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className={`h-8 px-3 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "map" ? "default" : "ghost"}
                className={`h-8 px-3 ${viewMode === "map" ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="container py-6">
        {viewMode === "grid" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-foreground">
                Nearby Games
              </h2>
              <span className="text-sm text-muted-foreground font-accent">
                {filteredGames.length} games found
              </span>
            </div>
            
            {filteredGames.length > 0 ? (
              <div className="grid gap-4">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <img
                  src="https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-5_1770793025000_na1fn_ZW1wdHktc3RhdGUtaWxsdXN0cmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTVfMTc3MDc5MzAyNTAwMF9uYTFmbl9aVzF3ZEhrdGMzUmhkR1V0YVd4c2RYTjBjbUYwYVc5dS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PKwk0cpe1R7hBodrpWgIWQufe~7gjFBvL1yQVj41tdbL1htBvz0ol7iM0mfLYHo37H4zpesQWwMHZ-q0AFh6kbbEurB6DcURwX241YsJkNIVLWENovPPkECL7rHxsULX3ZPkEN3l6rL2zcnPevueFxK7ItLyJ2B9Mji3cIpi1Ruy02U2Li1LLfmL5nSo-scGlq-fhiswYY~rMu3oD3ra0PsLxiypuaKv8rTkm-OdPsT0pgAN6JSpArc1a9V5dQiLAf4Avj6PPT9pzUO0Uj5Bh~Gw2fxC2fJ6RHm4y19YbgLy8kxg7KzXzB5MLlNVvZ9e3su5hiRhPz20u6EAPVQueA__"
                  alt="No games found"
                  className="w-48 h-48 object-contain opacity-60"
                />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-display font-bold text-foreground">
                    No Games Found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or create a new game
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-muted rounded-2xl h-[500px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapIcon className="w-12 h-12 mx-auto text-neon-cyan" />
              <p className="text-muted-foreground">Map view coming soon</p>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
