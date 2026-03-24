import { cn } from "@/lib/utils";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Hybrid";

interface SkillBadgeProps {
  level: SkillLevel;
  colored?: boolean;
  className?: string;
}

const coloredStyles: Record<SkillLevel, string> = {
  Beginner: "border-[#3a4136] bg-[#1a1f1a] text-[#d2dbd3]",
  Intermediate: "border-[#88dd39] bg-[#1e2b1b] text-[#d6ffac]",
  Advanced: "border-[#3f473f] bg-[#1a201b] text-[#cdd7ce]",
  Hybrid: "border-[#4b563f] bg-[#202a1f] text-[#d4e8bf]",
};

export default function SkillBadge({ level, colored = false, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        colored ? coloredStyles[level] : "border-[#323a33] bg-[#141a15] text-[#cbd5cd]",
        className
      )}
    >
      {level}
    </span>
  );
}
