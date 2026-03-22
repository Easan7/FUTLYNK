import { cn } from "@/lib/utils";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Hybrid";

interface SkillBadgeProps {
  level: SkillLevel;
  colored?: boolean;
  className?: string;
}

const coloredStyles: Record<SkillLevel, string> = {
  Beginner: "bg-emerald-500/18 text-emerald-200 border-emerald-400/45 shadow-[0_0_10px_rgba(16,185,129,0.16)]",
  Intermediate: "bg-[#d3ff5a1f] text-[#e8ffc1] border-[#b9ff48]/45 shadow-[0_0_10px_rgba(185,255,72,0.18)]",
  Advanced: "bg-rose-500/18 text-rose-100 border-rose-400/45 shadow-[0_0_10px_rgba(251,113,133,0.16)]",
  Hybrid: "bg-cyan-500/18 text-cyan-100 border-cyan-400/45 shadow-[0_0_10px_rgba(34,211,238,0.18)]",
};

export default function SkillBadge({ level, colored = false, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        colored ? coloredStyles[level] : "bg-[#141923] border-[#34405b] text-[#d9e1ee]",
        className
      )}
    >
      {level}
    </span>
  );
}
