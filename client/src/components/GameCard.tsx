import { Calendar, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import SkillBadge from "./SkillBadge";
import { cn } from "@/lib/utils";
import type { SkillLevel } from "./SkillBadge";

export interface Game {
  id: string;
  location: string;
  date: string;
  time: string;
  skillLevel: SkillLevel;
  playersJoined: number;
  maxPlayers: number;
  price?: number;
}

interface GameCardProps {
  game: Game;
  href?: string;
  actionLabel?: string;
  onAction?: (game: Game) => void;
  actionVariant?: "primary" | "secondary";
  className?: string;
}

export default function GameCard({
  game,
  href,
  actionLabel = "View Room",
  onAction,
  actionVariant = "primary",
  className,
}: GameCardProps) {
  const playerPercentage = Math.max(0, Math.min(100, (game.playersJoined / game.maxPlayers) * 100));
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (playerPercentage / 100) * circumference;
  const targetHref = href ?? `/game/${game.id}`;

  return (
    <article className={cn("surface-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <Link href={targetHref} className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-[#f2f7f2]">{game.location}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9aa89f]">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {game.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {game.time}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <SkillBadge level={game.skillLevel} colored />
            <span className="text-sm font-semibold text-[#f2f7f2]">${game.price ?? "-"}</span>
          </div>
        </Link>

        <div className="relative h-11 w-11 shrink-0">
          <svg viewBox="0 0 40 40" className="-rotate-90">
            <circle cx="20" cy="20" r={radius} stroke="#252c26" strokeWidth="3" fill="none" />
            <circle
              cx="20"
              cy="20"
              r={radius}
              stroke="#9dff3f"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-[#deeadf]">
            {game.playersJoined}/{game.maxPlayers}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#9eaca3]">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {game.playersJoined}/{game.maxPlayers} joined
        </span>
        <span>{playerPercentage}% filled</span>
      </div>

      <div className="mt-2 h-1.5 rounded-full bg-[#252d27]">
        <div className="h-full rounded-full bg-[#9dff3f]" style={{ width: `${playerPercentage}%` }} />
      </div>

      {onAction ? (
        <button
          onClick={() => onAction(game)}
          className={cn(
            "mt-3 w-full rounded-xl py-2 text-sm font-medium",
            actionVariant === "primary"
              ? "bg-[#9dff3f] text-[#0f150c]"
              : "border border-[#343d34] bg-[#171d18] text-[#d7e1d9]"
          )}
        >
          {actionLabel}
        </button>
      ) : (
        <Link
          href={targetHref}
          className={cn(
            "mt-3 block w-full rounded-xl py-2 text-center text-sm font-medium",
            actionVariant === "primary"
              ? "bg-[#9dff3f] text-[#0f150c]"
              : "border border-[#343d34] bg-[#171d18] text-[#d7e1d9]"
          )}
        >
          {actionLabel}
        </Link>
      )}
    </article>
  );
}
