import { cn } from "@/lib/utils";

type PitchOverlayVariant = "header" | "card" | "divider";

interface PitchOverlayProps {
  variant?: PitchOverlayVariant;
  className?: string;
}

const variantClasses: Record<PitchOverlayVariant, string> = {
  header: "pointer-events-none absolute inset-0 opacity-0",
  card: "pointer-events-none absolute inset-0 opacity-42",
  divider: "pointer-events-none relative block h-3 w-full opacity-58",
};

export default function PitchOverlay({ variant = "card", className }: PitchOverlayProps) {
  if (variant === "header") {
    return null;
  }

  if (variant === "divider") {
    return (
      <div className={cn(variantClasses.divider, className)} aria-hidden>
        <svg
          viewBox="0 0 100 12"
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 0 5px rgba(157,255,63,0.28))" }}
        >
          <line x1="0" y1="6" x2="100" y2="6" stroke="rgba(157,255,63,0.34)" strokeWidth="0.95" />
          <circle cx="50" cy="6" r="2.3" fill="none" stroke="rgba(157,255,63,0.48)" strokeWidth="1.0" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn(variantClasses[variant], className)} aria-hidden>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 0 6px rgba(157,255,63,0.22))" }}
      >
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(157,255,63,0.2)" strokeWidth="0.75" />
        <line x1="0" y1="76" x2="100" y2="76" stroke="rgba(157,255,63,0.14)" strokeWidth="0.75" />
        <path d="M38 50a12 12 0 0 1 24 0" fill="none" stroke="rgba(157,255,63,0.38)" strokeWidth="0.88" />
        <circle cx="50" cy="50" r="6.5" fill="none" stroke="rgba(157,255,63,0.3)" strokeWidth="0.88" />
      </svg>
    </div>
  );
}
