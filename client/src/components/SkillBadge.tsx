/*
 * SkillBadge Component - Clean, minimal design
 * Inspired by modern mobile apps - simple and professional
 */

import { cn } from "@/lib/utils";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

interface SkillBadgeProps {
  level: SkillLevel;
  className?: string;
}

export default function SkillBadge({ level, className }: SkillBadgeProps) {
  const styles = {
    Beginner: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      indicator: "bg-emerald-500"
    },
    Intermediate: {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      indicator: "bg-amber-500"
    },
    Advanced: {
      bg: "bg-rose-500/15",
      text: "text-rose-400",
      indicator: "bg-rose-500"
    },
  };

  const style = styles[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn("w-1 h-1 rounded-full", style.indicator)} />
      {level}
    </div>
  );
}
