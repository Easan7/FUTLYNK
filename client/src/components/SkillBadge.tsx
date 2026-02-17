/*
 * SkillBadge Component - Minimal outlined design
 * Simple border-only badges with color-coded text
 */

import { cn } from "@/lib/utils";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

interface SkillBadgeProps {
  level: SkillLevel;
  className?: string;
}

export default function SkillBadge({ level, className }: SkillBadgeProps) {
  const styles = {
    Beginner: "border-green-500 text-green-400",
    Intermediate: "border-cyan-500 text-cyan-400",
    Advanced: "border-purple-500 text-purple-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium",
        styles[level],
        className
      )}
    >
      {level}
    </div>
  );
}
