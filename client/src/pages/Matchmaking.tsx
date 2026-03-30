import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { SlidersHorizontal, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import PitchOverlay from "@/components/PitchOverlay";
import { toast } from "sonner";
import { apiGet, DEFAULT_USER_ID } from "@/lib/api";

type FilterKey = "all" | "intermediate" | "hybrid";

export default function Matchmaking() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [useAvailability, setUseAvailability] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiGet<{ rooms: any[] }>(
          `/api/v1/rooms/discover?user_id=${DEFAULT_USER_ID}&use_availability=${useAvailability}`
        );
        setRooms(payload.rooms ?? []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load rooms";
        toast.error(message);
      }
    };

    void load();
  }, [useAvailability]);

  const evaluatedRooms = useMemo(() => {
    const rankedRooms = rooms
      .map((room) => ({
        ...room,
        fitReason:
          room.fitScore >= 86
            ? "Strong skill alignment and stable room balance"
            : room.matchingAvailability
              ? "Matches your availability and expected pace"
              : room.hiddenRatingSpread <= 0.4
                ? "Tight skill spread for a cleaner game"
                : "Suitable room with comparable level players",
      }))
      .sort((a, b) => b.fitScore - a.fitScore);

    return rankedRooms.map((room, index) => ({
      ...room,
      fitLabel:
        index === 0
          ? "Best fit for you"
          : room.fitScore >= 82
            ? "Strong match"
            : room.fitScore >= 72
              ? "Solid option"
              : "Worth considering",
    }));
  }, [rooms]);

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
  const featuredRoom = filteredRooms[0];

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <h1 className="relative z-10 text-2xl font-semibold text-[#f2f7f2]">Find a Game</h1>
        <p className="relative z-10 mt-1 text-xs text-[#97a49b]">Filter by type or venue</p>

        <div className="relative z-10 mt-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venue or room"
            className="h-10"
          />
        </div>

        <div className="relative z-10 mt-3 flex items-center gap-2 overflow-x-auto">
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

      <main className="space-y-4 p-4">
        <PitchOverlay variant="divider" />
        {featuredRoom ? (
          <article className="surface-card pitch-lines relative overflow-hidden border-[#426043]">
            <PitchOverlay variant="card" />
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9faea4]">Top Match</p>
                <h2 className="mt-1 text-lg font-semibold text-[#f2f7f2]">{featuredRoom.location}</h2>
                <p className="mt-1 text-sm text-[#98a69d]">
                  {featuredRoom.date} · {featuredRoom.time}
                  {featuredRoom.priceVisible === false ? "" : ` · $${featuredRoom.price}`}
                </p>
                <p className="mt-1 text-sm text-[#b8c5bb]">
                  <span className="text-[#9dff3f]">{featuredRoom.fitLabel}</span> · {featuredRoom.fitReason}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {featuredRoom.allowedBand ? <SkillBadge level={featuredRoom.allowedBand} colored /> : <SkillBadge level="Hybrid" colored />}
                  <span className="chip">
                    {featuredRoom.playersJoined}/{featuredRoom.maxPlayers}
                  </span>
                </div>
              </div>
            </div>
            <Link href={`/game/${featuredRoom.id}?source=matchmaking`} className="btn-primary relative z-10 mt-4 w-full shadow-[0_10px_24px_rgba(157,255,63,0.2)]">
              Join Best Match
            </Link>
          </article>
        ) : null}

        {filteredRooms.slice(1).map((room) => {
          const fillPct = Math.round((room.playersJoined / room.maxPlayers) * 100);

          return (
            <article key={room.id} className="surface-card relative overflow-hidden border-[#2f3b32] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#435646] hover:bg-[#141c16]">
              <PitchOverlay variant="card" />
              <div className="flex items-start justify-between gap-2">
                <div className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8ea090]">Room Option</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#f2f7f2]">{room.location}</h3>
                  <p className="mt-1 text-sm text-[#98a69d]">
                    {room.date} · {room.time}
                    {room.priceVisible === false ? "" : ` · $${room.price}`}
                  </p>
                  <p className="mt-1 text-sm text-[#b8c5bb]">
                    <span className="text-[#9dff3f]">{room.fitLabel}</span> · {room.fitReason}
                  </p>
                </div>
                {room.allowedBand ? (
                  <SkillBadge level={room.allowedBand} colored />
                ) : (
                  <SkillBadge level="Hybrid" colored />
                )}
              </div>

              <div className="relative z-10 mt-3 flex items-center justify-between text-sm text-[#9aa89f]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {room.playersJoined}/{room.maxPlayers} players
                </span>
                <span>{fillPct}% full</span>
              </div>

              <div className="relative z-10 mt-2 h-1.5 rounded-full bg-[#252d27]">
                <div className="h-full rounded-full bg-[#9dff3f]" style={{ width: `${fillPct}%` }} />
              </div>

              <Link href={`/game/${room.id}?source=matchmaking`} className="btn-primary relative z-10 mt-3 w-full">
                Join Game
              </Link>
            </article>
          );
        })}

        {filteredRooms.length === 0 && (
          <section className="surface-card">
            <p className="text-sm text-[#9aa79e]">No rooms found for current filters.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="btn-secondary text-xs"
                onClick={() => {
                  setActiveFilter("all");
                  setUseAvailability(false);
                }}
              >
                Relax Filters
              </button>
              <button className="btn-secondary text-xs" onClick={() => setQuery("")}>
                Clear Search
              </button>
            </div>
          </section>
        )}
      </main>

      <Navigation />
    </div>
  );
}
