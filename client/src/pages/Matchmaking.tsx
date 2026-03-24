import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, SlidersHorizontal, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, getAllowedRoomsForUser, getFitLabel, getFitReason, getRoomFitScore } from "@/data/mockData";
import { Input } from "@/components/ui/input";

type FilterKey = "all" | "intermediate" | "hybrid";

export default function Matchmaking() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [useAvailability, setUseAvailability] = useState(true);

  const evaluatedRooms = useMemo(() => {
    return getAllowedRoomsForUser(currentUser.publicSkillBand)
      .map((room) => {
        const fitScore = getRoomFitScore(currentUser.hiddenSkillRating, room);
        return {
          ...room,
          fitScore,
          fitLabel: getFitLabel(fitScore),
          fitReason: getFitReason(room, fitScore),
        };
      })
      .sort((a, b) => b.fitScore - a.fitScore);
  }, []);

  const filteredRooms = useMemo(() => {
    return evaluatedRooms
      .filter((room) => {
        if (activeFilter === "intermediate") return room.allowedBand === "Intermediate";
        if (activeFilter === "hybrid") return room.allowedBand === null;
        return true;
      })
      .filter((room) =>
        `${room.title} ${room.location}`.toLowerCase().includes(query.toLowerCase().trim())
      )
      .filter((room) => (useAvailability ? room.matchingAvailability : true));
  }, [activeFilter, evaluatedRooms, query, useAvailability]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="text-2xl font-semibold text-[#f2f7f2]">Search</h1>
        <p className="mt-1 text-xs text-[#97a49b]">Find rooms by time, level, and player count.</p>

        <div className="mt-3 flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venue or room"
            className="h-10"
          />
          <button className="btn-primary h-10 px-3">
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          {["all", "intermediate", "hybrid"].map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as FilterKey)}
              className={`chip whitespace-nowrap ${activeFilter === key ? "chip-active" : ""}`}
            >
              {key === "all" ? "All Rooms" : key === "intermediate" ? "Intermediate" : "Hybrid"}
            </button>
          ))}

          <button
            onClick={() => setUseAvailability((prev) => !prev)}
            className={`ml-auto chip whitespace-nowrap ${useAvailability ? "chip-active" : ""}`}
          >
            <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
            Use My Availability
          </button>
        </div>
      </header>

      <main className="space-y-3 p-4">
        {filteredRooms.map((room) => {
          const fillPct = Math.round((room.playersJoined / room.maxPlayers) * 100);

          return (
            <article key={room.id} className="surface-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-[#f2f7f2]">{room.location}</h3>
                  <p className="mt-1 text-xs text-[#98a69d]">
                    {room.date} · {room.time} · ${room.price}
                  </p>
                  <p className="mt-1 text-[11px] text-[#b8c5bb]">
                    <span className="text-[#9dff3f]">{room.fitLabel}</span> · {room.fitReason}
                  </p>
                </div>
                {room.allowedBand ? (
                  <SkillBadge level={room.allowedBand} colored />
                ) : (
                  <SkillBadge level="Hybrid" colored />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[#9aa89f]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {room.playersJoined}/{room.maxPlayers} players
                </span>
                <span>{fillPct}% full</span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[#252d27]">
                <div className="h-full rounded-full bg-[#9dff3f]" style={{ width: `${fillPct}%` }} />
              </div>

              <Link href={`/game/${room.id}?source=matchmaking`}>
                <button className="btn-primary mt-3 w-full">Join Game</button>
              </Link>
            </article>
          );
        })}

        {filteredRooms.length === 0 && (
          <p className="surface-card text-sm text-[#9aa79e]">No rooms found for this filter.</p>
        )}
      </main>

      <Navigation />
    </div>
  );
}
