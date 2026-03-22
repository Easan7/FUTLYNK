/*
 * SkillBadge Component - Solid rectangle, no frills
 */

import { cn } from "@/lib/utils";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Hybrid";

interface SkillBadgeProps {
  level: SkillLevel;
  colored?: boolean;
  className?: string;
}

const coloredStyles: Record<SkillLevel, string> = {
  Beginner: "bg-emerald-600 text-white border-emerald-600",
  Intermediate: "bg-amber-500 text-black border-amber-500",
  Advanced: "bg-rose-600 text-white border-rose-600",
  Hybrid: "bg-sky-600 text-white border-sky-600",
};

export default function SkillBadge({ level, colored = false, className }: SkillBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm border",
        colored
          ? coloredStyles[level]
          : "bg-[#1a1a1a] border-[#2a2a2a] text-white",
        className
      )}
    >
      {level}
    </div>
  );
}
