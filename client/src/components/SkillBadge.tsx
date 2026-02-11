/*
 * SkillBadge Component - Cyberpunk Athleticism
 * Hexagonal badge design with neon glow for skill ratings
 */

import { cn } from "@/lib/utils";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

interface SkillBadgeProps {
  level: SkillLevel;
  className?: string;
}

export default function SkillBadge({ level, className }: SkillBadgeProps) {
  const styles = {
    Beginner: "bg-neon-green/10 text-neon-green border-neon-green/30",
    Intermediate: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
    Advanced: "bg-primary/10 text-primary border-primary/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 font-accent text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105",
        styles[level],
        className
      )}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {level}
    </div>
  );
}
