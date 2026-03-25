import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  total?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: { box: 34, radius: 13, stroke: 2.5, text: "text-[9px]" },
  md: { box: 42, radius: 16, stroke: 2.8, text: "text-[10px]" },
  lg: { box: 52, radius: 20, stroke: 3.2, text: "text-xs" },
};

export default function ProgressRing({ value, total = 1, size = "md", label, className }: ProgressRingProps) {
  const config = sizeMap[size];
  const normalized = value > 1 ? value / 100 : value / total;
  const progress = Math.max(0, Math.min(1, normalized));
  const circumference = 2 * Math.PI * config.radius;
  const dashOffset = circumference - progress * circumference;

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: config.box, height: config.box }}>
      <svg viewBox={`0 0 ${config.box} ${config.box}`} className="-rotate-90">
        <circle
          cx={config.box / 2}
          cy={config.box / 2}
          r={config.radius}
          stroke="#2a322b"
          strokeWidth={config.stroke}
          fill="none"
        />
        <circle
          cx={config.box / 2}
          cy={config.box / 2}
          r={config.radius}
          stroke="#9dff3f"
          strokeWidth={config.stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {label ? (
        <span className={cn("absolute font-semibold tabular-nums tracking-tight text-[#e6f0e8]", config.text)}>{label}</span>
      ) : null}
    </div>
  );
}
