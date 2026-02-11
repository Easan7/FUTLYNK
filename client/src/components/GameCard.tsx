/*
 * GameCard Component - Cyberpunk Athleticism
 * Diagonal-cut cards with neon borders and hover glow effects
 */

import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import SkillBadge from "./SkillBadge";
import { Button } from "./ui/button";

export interface Game {
  id: string;
  location: string;
  date: string;
  time: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  playersJoined: number;
  maxPlayers: number;
  price?: number;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const playerPercentage = (game.playersJoined / game.maxPlayers) * 100;

  return (
    <Link href={`/game/${game.id}`}>
      <div className="group relative bg-card border-2 border-border rounded-2xl p-5 transition-all duration-300 hover:border-neon-green/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-neon-green/20 cursor-pointer overflow-hidden">
        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-r from-neon-green to-neon-cyan transform translate-x-4 -translate-y-0 rotate-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-medium">{game.location}</span>
              </div>
              <SkillBadge level={game.skillLevel} />
            </div>
            {game.price && (
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-neon-green">
                  ${game.price}
                </div>
                <div className="text-xs text-muted-foreground">per player</div>
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-neon-cyan" />
              <span className="font-medium">{game.date}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4 text-neon-cyan" />
              <span className="font-medium">{game.time}</span>
            </div>
          </div>

          {/* Players Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neon-green" />
                <span className="font-accent font-semibold text-foreground">
                  {game.playersJoined}/{game.maxPlayers} Players
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {game.maxPlayers - game.playersJoined} spots left
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                style={{ width: `${playerPercentage}%` }}
              />
            </div>
          </div>

          {/* Join Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/30"
            onClick={(e) => {
              e.preventDefault();
              // Join game logic
            }}
          >
            Join Game
          </Button>
        </div>
      </div>
    </Link>
  );
}
