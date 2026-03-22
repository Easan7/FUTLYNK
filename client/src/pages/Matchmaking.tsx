import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Clock3, Filter, MapPin, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, getAllowedRoomsForUser, getFitLabel, getFitReason, getRoomFitScore } from "@/data/mockData";
import AppHero from "@/components/AppHero";

type FilterKey = "all" | "best" | "my-level" | "open";

export default function Matchmaking() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const evaluatedRooms = useMemo(() => {
    return getAllowedRoomsForUser(currentUser.publicSkillBand)
      .map((room) => {
        const fitScore = getRoomFitScore(currentUser.hiddenSkillRating, room);
        return {
          ...room,
          fitScore,
          fitLabel: getFitLabel(fitScore),
          reason: getFitReason(room, fitScore),
        };
      })
      .sort((a, b) => b.fitScore - a.fitScore);
  }, []);

  const visibleRooms = useMemo(() => {
    if (activeFilter === "best") return evaluatedRooms.filter((r) => r.fitScore >= 80);
    if (activeFilter === "my-level") return evaluatedRooms.filter((r) => r.allowedBand === currentUser.publicSkillBand);
    if (activeFilter === "open") return evaluatedRooms.filter((r) => r.allowedBand === null);
    return evaluatedRooms;
  }, [activeFilter, evaluatedRooms]);

  const summary = useMemo(() => {
    const best = evaluatedRooms[0];
    const weekCount = evaluatedRooms.filter((r) => r.weekTag === "This week").length;
    const matchingAvailability = evaluatedRooms.filter((r) => r.matchingAvailability).length;
    return { best, weekCount, matchingAvailability };
  }, [evaluatedRooms]);

  return (
    <div className="min-h-screen bg-[#0a0d14] pb-24">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0d14]/95 px-4 pb-5 pt-5 backdrop-blur-sm">
        <AppHero
          className="mb-4 h-[170px] sm:h-[184px]"
          title="Match Recommendations"
          subtitle="Rooms are recommended based on your skill fit, availability, and game balance."
          badge="Tactical room map"
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-[#22314a] bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea0bd]">Best fit near you</p>
            <p className="mt-1 text-sm font-semibold text-white">{summary.best?.location ?? "-"}</p>
          </div>
          <div className="rounded-2xl border border-[#22314a] bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea0bd]">Available this week</p>
            <p className="mt-1 text-lg font-semibold text-white">{summary.weekCount}</p>
          </div>
          <div className="rounded-2xl border border-[#22314a] bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea0bd]">Matching your availability</p>
            <p className="mt-1 text-lg font-semibold text-[#a8ff3f]">{summary.matchingAvailability}</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4">
        <section className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            ["all", "All"],
            ["best", "Best Fit"],
            ["my-level", "My Level"],
            ["open", "Open / Mixed"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as FilterKey)}
              className={`neo-chip whitespace-nowrap transition-all ${
                activeFilter === key
                  ? "neo-chip-active"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-1 text-xs text-[#7f91ad]">
            <Filter className="h-3.5 w-3.5" />
            {visibleRooms.length} rooms
          </span>
        </section>

        <section className="space-y-3">
          {visibleRooms.map((room) => {
            const fillPct = Math.round((room.playersJoined / room.maxPlayers) * 100);

            return (
              <Link key={room.id} href={`/game/${room.id}?source=matchmaking`}>
                <article className="surface-card p-4 transition-all hover:border-[#3a4b68]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#a8ff3f]">{room.fitLabel}</p>
                      <h3 className="mt-1 text-base font-semibold text-white">{room.title}</h3>
                      <p className="mt-1 text-xs text-[#8fa0bc]">{room.reason}</p>
                    </div>
                    {room.allowedBand === null ? (
                      <SkillBadge level="Hybrid" colored />
                    ) : (
                      <SkillBadge level={room.allowedBand} colored />
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#a7b7d0]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {room.location} · {room.distanceKm.toFixed(1)} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {room.date} · {room.time}
                    </span>
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#101624] p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#a0b2ce]">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {room.playersJoined}/{room.maxPlayers} players
                      </span>
                      <span>{fillPct}% filled</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#202b3f]">
                      <div className="h-full rounded-full bg-[#a8ff3f]" style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">${room.price}/player</p>
                    <button className="rounded-xl bg-[#a8ff3f] px-3 py-1.5 text-xs font-semibold text-[#10160f]">View Room</button>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      </main>

      <Navigation />
    </div>
  );
}
