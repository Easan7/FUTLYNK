/*
 * SkillBadge Component - Modern, clean design with subtle animations
 * Inspired by modern web apps, no emojis
 */

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

interface SkillBadgeProps {
  level: SkillLevel;
  className?: string;
}

export default function SkillBadge({ level, className }: SkillBadgeProps) {
  const styles = {
    Beginner: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      dot: "bg-emerald-500"
    },
    Intermediate: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      dot: "bg-amber-500"
    },
    Advanced: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      dot: "bg-rose-500"
    },
  };

  const style = styles[level];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm text-xs font-semibold uppercase tracking-wider",
        style.bg,
        style.border,
        style.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {level}
    </motion.div>
  );
}
