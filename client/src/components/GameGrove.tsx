import { cn } from "@/lib/utils";

interface GameGroveProps {
  gamesPlayed: number;
  className?: string;
}

export default function GameGrove({ gamesPlayed, className }: GameGroveProps) {
  const cap = 35;
  const active = Math.min(gamesPlayed, cap);

  return (
    <div className={cn("rounded-2xl border border-[#283127] bg-[#121712] p-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#eef4ef]">Game Grove</p>
        <span className="text-xs text-[#9dff3f] tabular-nums">{gamesPlayed} played</span>
      </div>
      <p className="mt-1 text-xs text-[#95a39a]">Each played game grows one tree.</p>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {Array.from({ length: cap }).map((_, idx) => {
          const filled = idx < active;
          return (
            <div
              key={idx}
              className={cn(
                "h-6 rounded-md border border-[#2d362d] bg-[#171d17]",
                filled ? "border-[#4f7f3a] bg-[#1e2a1e]" : ""
              )}
            >
              <div className="mx-auto mt-1 h-2.5 w-2.5 rounded-full bg-[#2f3a31]" />
              <div className={cn("mx-auto mt-0.5 h-1.5 w-[2px] rounded bg-[#2f3a31]", filled ? "bg-[#9dff3f]" : "")} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
