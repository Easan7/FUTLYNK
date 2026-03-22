import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "wouter";
import SkillBadge from "./SkillBadge";

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
      <article className="rounded-3xl border border-[#222b3c] bg-[#121925] p-4 text-left transition-all hover:border-[#33425e] hover:bg-[#151f2e]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">{game.location}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-[#99a8c0]">
              <MapPin className="h-3.5 w-3.5" />
              <span>Indoor release</span>
            </div>
          </div>
          <SkillBadge level={game.skillLevel} colored />
        </div>

        <div className="mb-3 flex items-center gap-4 text-xs text-[#b6c2d7]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {game.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {game.time}
          </span>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-[#9fb0ca]">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {game.playersJoined}/{game.maxPlayers} players
            </span>
            <span>{game.maxPlayers - game.playersJoined} spots left</span>
          </div>
          <div className="h-2 rounded-full bg-[#1d2738]">
            <div
              className="h-full rounded-full bg-[#a8ff3f]"
              style={{ width: `${playerPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#a8ff3f]">${game.price ?? "-"}/player</p>
          <span className="rounded-xl bg-[#1b2536] px-3 py-1 text-xs font-semibold text-[#dbe3f2]">
            View room
          </span>
        </div>
      </article>
    </Link>
  );
}
