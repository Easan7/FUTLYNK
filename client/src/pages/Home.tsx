import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Bell, CalendarDays, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import GameCard, { type Game } from "@/components/GameCard";
import type { SkillLevel } from "@/components/SkillBadge";
import { toast } from "sonner";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import { apiGet, apiPost, DEFAULT_USER_ID } from "@/lib/api";

const toSkillLevel = (value: string | null | undefined): SkillLevel =>
  value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Hybrid"
    ? value
    : "Hybrid";

type HomeData = {
  currentUser: {
    id: string;
    name: string;
    reliabilityScore: number;
    streakWeeks: number;
  };
  upcomingGames: Array<{
    id: string;
    location: string;
    date: string;
    time: string;
    price: number;
    priceVisible?: boolean;
    playersJoined: number;
    maxPlayers: number;
    allowedBand: string | null;
  }>;
  pendingRatings: Array<{ id: string; location: string; date: string }>;
};

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHome = async () => {
    try {
      setLoading(true);
      const payload = await apiGet<HomeData>(`/api/v1/app/home?user_id=${DEFAULT_USER_ID}`);
      setData(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load home data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHome();
  }, []);

  const upcomingGames = data?.upcomingGames ?? [];
  const pendingRatings = data?.pendingRatings ?? [];
  const nextGame = upcomingGames[0];

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <p className="text-[11px] text-[#93a299]">Welcome back</p>
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">My Games</h1>
          </div>
          <Link href="/notifications" className="btn-secondary relative z-10 !min-h-10 !px-3" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-3 gap-2">
          <StatBlock variant="card" label="Joined" value={upcomingGames.length} />
          <StatBlock variant="card" label="Reliability" value={`${data?.currentUser?.reliabilityScore ?? 0}%`} />
          <StatBlock variant="card" label="Streak" value={`${data?.currentUser?.streakWeeks ?? 0}w`} />
        </div>
      </header>

      <main className="space-y-4 p-4">
        {loading ? <section className="surface-card text-sm text-[#9aa79e]">Loading…</section> : null}
        {nextGame ? (
          <section className="surface-card pitch-lines relative overflow-hidden">
            <PitchOverlay variant="card" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9eada3]">Next Match</p>
                <h2 className="mt-1 text-base font-semibold text-[#f2f7f2]">{nextGame.location}</h2>
                <p className="mt-1 text-sm text-[#9aa79e]">
                  {nextGame.date} · {nextGame.time}
                  {nextGame.priceVisible === false ? "" : ` · $${nextGame.price}`}
                </p>
              </div>
              <span className="chip chip-active">
                {nextGame.playersJoined}/{nextGame.maxPlayers}
              </span>
            </div>
            <div className="relative z-10 mt-3 grid grid-cols-2 gap-2">
              <Link href={`/game/${nextGame.id}`} className="btn-primary">
                Open Match
              </Link>
              <button
                className="btn-secondary"
                onClick={async () => {
                  if (!window.confirm("Leave this game?")) return;
                  await apiPost(`/api/v1/rooms/${nextGame.id}/leave`, { user_id: DEFAULT_USER_ID });
                  setData((prev) =>
                    prev
                      ? { ...prev, upcomingGames: prev.upcomingGames.filter((g) => g.id !== nextGame.id) }
                      : prev
                  );
                  toast.success("You left this game");
                }}
              >
                Leave Game
              </button>
            </div>
          </section>
        ) : null}

        {pendingRatings.length > 0 && (
          <section className="surface-card">
            <p className="text-sm font-semibold text-[#f2f7f2]">Rate Players</p>
            <div className="mt-3 space-y-2">
              {pendingRatings.map((item) => (
                <div key={item.id} className="surface-inner flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[#eef4ef]">{item.location}</p>
                    <p className="mt-1 text-sm text-[#9aa79e]">{item.date}</p>
                  </div>
                  <Link href={`/feedback/${item.id}`} className="btn-primary h-9 px-3 text-xs">
                    Rate
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="surface-card pitch-lines">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-heading">Upcoming</h2>
          </div>
          <PitchOverlay variant="divider" className="mb-3" />

          <div className="space-y-3">
            {upcomingGames.slice(1).map((room) => {
              const game: Game = {
                id: room.id,
                location: room.location,
                date: room.date,
                time: room.time,
                playersJoined: room.playersJoined,
                maxPlayers: room.maxPlayers,
                price: room.price,
                priceVisible: room.priceVisible,
                skillLevel: toSkillLevel(room.allowedBand),
              };

              return (
                <GameCard
                  key={room.id}
                  game={game}
                  href={`/game/${room.id}`}
                  actionLabel="Leave Game"
                  actionVariant="secondary"
                  onAction={async () => {
                    if (!window.confirm("Leave this game?")) return;
                    await apiPost(`/api/v1/rooms/${room.id}/leave`, { user_id: DEFAULT_USER_ID });
                    setData((prev) =>
                      prev
                        ? { ...prev, upcomingGames: prev.upcomingGames.filter((g) => g.id !== room.id) }
                        : prev
                    );
                    toast.success("You left this game");
                  }}
                />
              );
            })}

            {upcomingGames.length <= 1 && (
              <p className="surface-inner text-sm text-[#9aa79e]">No additional upcoming games.</p>
            )}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
