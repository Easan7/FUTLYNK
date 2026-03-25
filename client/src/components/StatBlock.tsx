import { cn } from "@/lib/utils";

type StatBlockVariant = "inline" | "card" | "compact";

interface StatBlockProps {
  label: string;
  value: string | number;
  subValue?: string;
  variant?: StatBlockVariant;
  className?: string;
}

const variantStyles: Record<StatBlockVariant, string> = {
  card: "rounded-xl border border-[#2f372f] bg-[#141b15] px-3 py-2.5",
  inline: "rounded-xl border border-[#2a322b] bg-[#141a15] px-3 py-2",
  compact: "rounded-lg border border-[#2a322b] bg-[#141a15] px-2.5 py-1.5",
};

const valueStyles: Record<StatBlockVariant, string> = {
  card: "text-xl",
  inline: "text-lg",
  compact: "text-sm",
};

export default function StatBlock({ label, value, subValue, variant = "card", className }: StatBlockProps) {
  return (
    <div className={cn(variantStyles[variant], className)}>
      <p className="text-[11px] text-[#8f9d93]">{label}</p>
      <p className={cn("mt-1 font-semibold tracking-tight tabular-nums text-[#eef4ef]", valueStyles[variant])}>{value}</p>
      {subValue ? <p className="mt-0.5 text-[11px] text-[#8f9d93]">{subValue}</p> : null}
    </div>
  );
}
