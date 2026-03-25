import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import PlayerCard3D from "./PlayerCard3D";
import PitchTimeline3D from "./PitchTimeline3D";
import AchievementLocker3D from "./AchievementLocker3D";
import type { Achievement3D, PlayerCardData3D, RecentMatch3D } from "./shared/types";

interface PlayerJourney3DProps {
  cardData: PlayerCardData3D;
  matches: RecentMatch3D[];
  achievements: Achievement3D[];
}

export default function PlayerJourney3D({ cardData, matches, achievements }: PlayerJourney3DProps) {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id ?? "");
  const [selectedAchievementId, setSelectedAchievementId] = useState(achievements[0]?.id ?? "");

  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) ?? matches[0],
    [matches, selectedMatchId]
  );
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
          <h2 className="mt-1 text-lg font-semibold text-[#f2f7f2]">3D Career Snapshot</h2>
          <p className="mt-1 text-xs text-[#97a49a]">Identity, recent matches, and earned status in one connected view.</p>
        </div>

        <div className="surface-inner p-2">
          <PlayerCard3D data={cardData} />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <StatBlock variant="compact" label="Games" value={cardData.games} />
            <StatBlock variant="compact" label="Reliability" value={`${cardData.reliability}%`} />
            <StatBlock variant="compact" label="Points" value={cardData.points} />
          </div>
        </div>

        <div className="surface-inner p-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#ecf3ed]">Mini Pitch Timeline</h3>
            <span className="chip">Recent matches</span>
          </div>
          <PitchTimeline3D matches={matches} selectedId={selectedMatchId} onSelect={setSelectedMatchId} />

          {selectedMatch ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <StatBlock variant="compact" label="Date" value={selectedMatch.date} />
              <StatBlock variant="compact" label="Players" value={selectedMatch.players} />
              <StatBlock variant="compact" label="Venue" value={selectedMatch.venue} className="col-span-2" />
              <div className="col-span-2 rounded-xl border border-[#2c352c] bg-[#131913] px-3 py-2 text-xs text-[#cbd8cd]">
                <div className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5 text-[#9dff3f]" />
                  Performance rating {selectedMatch.rating.toFixed(1)} / 5
                </div>
                <div className="mt-1 inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#9dff3f]" />
                  {selectedMatch.special ? `Special: ${selectedMatch.special}` : "Regular session"}
                </div>
              </div>
            </div>
          ) : null}
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
