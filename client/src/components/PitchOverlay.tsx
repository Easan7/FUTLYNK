import { cn } from "@/lib/utils";

type PitchOverlayVariant = "header" | "card" | "divider";

interface PitchOverlayProps {
  variant?: PitchOverlayVariant;
  className?: string;
}

const variantClasses: Record<PitchOverlayVariant, string> = {
  header: "absolute inset-0 opacity-35",
  card: "absolute inset-0 opacity-30",
  divider: "relative block h-3 w-full opacity-45",
};

export default function PitchOverlay({ variant = "card", className }: PitchOverlayProps) {
  if (variant === "divider") {
    return (
      <div className={cn(variantClasses.divider, className)} aria-hidden>
        <svg viewBox="0 0 100 12" className="h-full w-full">
          <line x1="0" y1="6" x2="100" y2="6" stroke="rgba(210,230,215,0.16)" strokeWidth="0.8" />
          <circle cx="50" cy="6" r="2.3" fill="none" stroke="rgba(157,255,63,0.18)" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn(variantClasses[variant], className)} aria-hidden>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(210,230,215,0.12)" strokeWidth="0.6" />
        <line x1="0" y1="76" x2="100" y2="76" stroke="rgba(210,230,215,0.08)" strokeWidth="0.6" />
        <path d="M38 50a12 12 0 0 1 24 0" fill="none" stroke="rgba(157,255,63,0.16)" strokeWidth="0.7" />
        <circle cx="50" cy="50" r="6.5" fill="none" stroke="rgba(210,230,215,0.10)" strokeWidth="0.7" />
      </svg>
    </div>
  );
}
