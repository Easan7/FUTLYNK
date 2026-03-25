import type { PlayerCardData3D } from "./shared/types";

interface PlayerCard3DProps {
  data: PlayerCardData3D;
  form: string;
  achievementCount: number;
  lastResult: string;
}

export default function PlayerCard3D({ data, form, achievementCount, lastResult }: PlayerCard3DProps) {
  return (
    <div className="rounded-xl border border-[#2b342b] bg-[#0f130f] p-3.5">
      <div className="flex h-full flex-col justify-between gap-2 text-[10px]">
        <div className="rounded-lg border border-[#2f372f] bg-[#101610]/90 px-2.5 py-2">
          <p className="text-sm font-semibold text-[#f0f6f1]">{data.name}</p>
          <p className="text-[11px] text-[#9faea3]">Tier: {data.skill}</p>
          <div className="mt-1.5 flex gap-1.5">
            {data.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-[#2f372f] bg-[#111711]/90 px-2 py-0.5 text-[10px] text-[#c8d4cb]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#2f372f] bg-[#111711]/90 px-2.5 py-2">
          <div className="mb-1.5 flex items-center justify-between text-[#8f9d93]">
            <span>Performance Strip</span>
            <span className="text-[#eef4ef]">{lastResult}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px] text-[#a6b4aa]">
              <span>Reliability</span>
              <span className="text-[#eef4ef]">{data.reliability}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#273127]">
              <div className="h-full rounded-full bg-[#9dff3f]" style={{ width: `${data.reliability}%` }} />
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#a6b4aa]">
              <span>Sportsmanship</span>
              <span className="text-[#eef4ef]">{data.sportsmanship}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#273127]">
              <div className="h-full rounded-full bg-[#88c98d]" style={{ width: `${data.sportsmanship}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-[#2f372f] bg-[#111711]/90 px-2 py-1 text-[#c8d4cb]">
            Games: <span className="font-semibold tabular-nums text-[#eef4ef]">{data.games}</span>
          </div>
          <div className="rounded-md border border-[#2f372f] bg-[#111711]/90 px-2 py-1 text-[#c8d4cb]">
            Points: <span className="font-semibold tabular-nums text-[#9dff3f]">{data.points}</span>
          </div>
          <div className="rounded-md border border-[#2f372f] bg-[#111711]/90 px-2 py-1 text-[#c8d4cb]">
            Form: <span className="font-semibold text-[#eef4ef]">{form}</span>
          </div>
          <div className="rounded-md border border-[#2f372f] bg-[#111711]/90 px-2 py-1 text-[#c8d4cb]">
            Awards: <span className="font-semibold tabular-nums text-[#eef4ef]">{achievementCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
