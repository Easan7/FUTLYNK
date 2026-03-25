import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import PitchOverlay from "@/components/PitchOverlay";
import PlayerCard3D from "./PlayerCard3D";
import AchievementLocker3D from "./AchievementLocker3D";
import type { Achievement3D, PlayerCardData3D } from "./shared/types";

interface PlayerJourney3DProps {
  cardData: PlayerCardData3D;
  achievements: Achievement3D[];
  snapshot: {
    strongestVenue: string;
    lastResult: string;
    formLastFive: string;
    avgRating: number;
    groupGames: number;
    fairPlayScore: number;
    nextFocus: string;
  };
}

export default function PlayerJourney3D({ cardData, achievements, snapshot }: PlayerJourney3DProps) {
  const [selectedAchievementId, setSelectedAchievementId] = useState(achievements[0]?.id ?? "");
  const selectedAchievement = useMemo(
    () => achievements.find((a) => a.id === selectedAchievementId) ?? achievements[0],
    [achievements, selectedAchievementId]
  );

  return (
    <section className="surface-card relative overflow-hidden">
      <PitchOverlay variant="card" />
      <div className="relative z-10 space-y-4">
        <div>
          <p className="text-[11px] text-[#93a198]">PLAYER JOURNEY</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f7f2]">Career Snapshot</h2>
          <p className="mt-1 text-xs text-[#97a49a]">Player identity card with embedded performance summary and achievement locker.</p>
        </div>

        <div className="surface-inner p-2">
          <PlayerCard3D
            data={cardData}
            form={snapshot.formLastFive}
            lastResult={snapshot.lastResult}
            achievementCount={achievements.filter((a) => a.unlocked).length}
          />
        </div>

        <div className="surface-inner p-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#ecf3ed]">Achievement Locker</h3>
            <span className="chip">{achievements.filter((a) => a.unlocked).length} unlocked</span>
          </div>
          <div className="mb-2 flex gap-2 overflow-x-auto">
            {["performance", "consistency", "social", "group", "fair-play"].map((category) => (
              <span key={category} className="chip text-[10px] capitalize">
                {category}
              </span>
            ))}
          </div>

          <AchievementLocker3D
            achievements={achievements}
            selectedId={selectedAchievementId}
            onSelect={setSelectedAchievementId}
          />

          {selectedAchievement ? (
            <div className="mt-2 rounded-xl border border-[#2c352c] bg-[#131913] px-3 py-2 text-xs">
              <p className="text-sm font-semibold text-[#ebf3ec]">{selectedAchievement.name}</p>
              <p className="mt-1 text-[#9ca99f]">{selectedAchievement.description}</p>
              <div className="mt-2 flex items-center justify-between text-[#c6d2c8]">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#9dff3f]" /> {selectedAchievement.rarity}
                </span>
                <span>{selectedAchievement.unlocked ? selectedAchievement.unlockedDate ?? "Unlocked" : "Locked"}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
