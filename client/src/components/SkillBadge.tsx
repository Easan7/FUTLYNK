/*
 * SkillBadge Component - Unique hexagonal design with gradients
 * Modern, non-generic styling with custom shapes
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
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-500/40",
      text: "text-green-400",
      glow: "shadow-green-500/20",
      icon: "🌱"
    },
    Intermediate: {
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/40",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/20",
      icon: "⚡"
    },
    Advanced: {
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/40",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
      icon: "🔥"
    },
  };

  const style = styles[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 bg-gradient-to-r backdrop-blur-sm text-xs font-bold uppercase tracking-wide shadow-lg transition-all hover:scale-105",
        style.gradient,
        style.border,
        style.text,
        style.glow,
        className
      )}
    >
      <span className="text-sm">{style.icon}</span>
      <span>{level}</span>
    </div>
  );
}
