import { Calendar, Clock } from "lucide-react";
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
  className?: string;
}

export default function GameCard({
  game,
  href,
  actionLabel = "View Game",
  onAction,
  className,
}: GameCardProps) {
  const playerPercentage = Math.max(0, Math.min(100, (game.playersJoined / game.maxPlayers) * 100));
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (playerPercentage / 100) * circumference;
  const targetHref = href ?? `/game/${game.id}`;

  return (
    <article
      className={cn(
        "rounded-2xl border border-[#273247] bg-[#121824] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.22)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link href={targetHref} className="min-w-0 flex-1">
          <div>
            <h3 className="truncate text-base font-semibold text-white">{game.location}</h3>
            <p className="mt-1 flex items-center gap-2 text-xs text-[#9aa8bf]">
              <Clock className="h-3.5 w-3.5" />
              <span>{game.time}</span>
              <span className="text-[#6f7d95]">•</span>
              <Calendar className="h-3.5 w-3.5" />
              <span>{game.date}</span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <SkillBadge level={game.skillLevel} />
              <span className="text-sm font-medium text-[#d7e2f0]">${game.price ?? "-"}</span>
            </div>
          </div>
        </Link>

        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 44 44" className="-rotate-90">
            <circle cx="22" cy="22" r={radius} stroke="#263247" strokeWidth="4" fill="none" />
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="#8ad94f"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-[#dce6f4]">
            {game.playersJoined}/{game.maxPlayers}
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-[#232f44]">
        <div className="h-full rounded-full bg-[#8ad94f]" style={{ width: `${playerPercentage}%` }} />
      </div>

      {onAction ? (
        <button
          onClick={() => onAction(game)}
          className="mt-3 w-full rounded-xl border border-[#33415a] bg-[#1a2334] py-2.5 text-sm font-medium text-[#d7e2f0] transition-colors hover:bg-[#202b3f]"
        >
          {actionLabel}
        </button>
      ) : (
        <Link
          href={targetHref}
          className="mt-3 block w-full rounded-xl border border-[#33415a] bg-[#1a2334] py-2.5 text-center text-sm font-medium text-[#d7e2f0] transition-colors hover:bg-[#202b3f]"
        >
          {actionLabel}
        </Link>
      )}
    </article>
  );
}
