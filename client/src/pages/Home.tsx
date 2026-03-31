import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import GameCard, { type Game } from "@/components/GameCard";
import FootballLoader from "@/components/FootballLoader";
import type { SkillLevel } from "@/components/SkillBadge";
import { toast } from "sonner";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import { apiGet, apiPost, getCurrentUserId } from "@/lib/api";

const toSkillLevel = (value: string | null | undefined): SkillLevel =>
  value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Hybrid"
    ? value
    : "Hybrid";

type HomeData = {
  currentUser: {
    id: string;
    name: string;
    reliabilityScore: number;
    gamesPlayed: number;
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
  const currentUserId = getCurrentUserId();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHome = async () => {
    try {
      setLoading(true);
      const payload = await apiGet<HomeData>(`/api/v1/app/home?user_id=${currentUserId}`);
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

  if (loading && !data) {
    return (
      <div className="app-shell">
        <FootballLoader fullScreen label="Loading your games..." />
        <Navigation />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 24 }}
        >
          <div className="relative z-10">
            <p className="text-[11px] text-[#93a299]">Welcome back</p>
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">My Games</h1>
          </div>
          <Link href="/notifications" className="btn-secondary relative z-10 !min-h-10 !px-3" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          className="relative z-10 mt-3 grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.24, ease: "easeOut" }}
        >
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
            <StatBlock variant="card" label="Joined" value={upcomingGames.length} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
            <StatBlock
              variant="card"
              label="Reliability"
              value={data?.currentUser?.gamesPlayed ? `${data.currentUser.reliabilityScore}%` : "Not rated"}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
            <StatBlock variant="card" label="Streak" value={`${data?.currentUser?.streakWeeks ?? 0}w`} />
          </motion.div>
        </motion.div>
      </header>

      <main className="space-y-4 p-4">
        {nextGame ? (
          <motion.section
            className="surface-card pitch-lines relative overflow-hidden"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 22, delay: 0.08 }}
          >
            <PitchOverlay variant="card" />
            <motion.div
              className="pointer-events-none absolute -top-8 left-1/2 z-0 h-20 w-40 -translate-x-1/2 rounded-full bg-[#beff78]/12 blur-xl"
              animate={{ opacity: [0.12, 0.3, 0.12], scale: [0.95, 1.03, 0.95] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
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
                  await apiPost(`/api/v1/rooms/${nextGame.id}/leave`, { user_id: currentUserId });
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
          </motion.section>
        ) : null}

        {pendingRatings.length > 0 && (
          <motion.section
            className="surface-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.24, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold text-[#f2f7f2]">Rate Players</p>
            <div className="mt-3 space-y-2">
              {pendingRatings.map((item) => (
                <motion.div
                  key={item.id}
                  className="surface-inner flex items-center justify-between gap-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div>
                    <p className="text-sm font-medium text-[#eef4ef]">{item.location}</p>
                    <p className="mt-1 text-sm text-[#9aa79e]">{item.date}</p>
                  </div>
                  <Link href={`/feedback/${item.id}`} className="btn-primary h-9 px-3 text-xs">
                    Rate
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          className="surface-card pitch-lines"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.24, ease: "easeOut" }}
        >
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
                    await apiPost(`/api/v1/rooms/${room.id}/leave`, { user_id: currentUserId });
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
        </motion.section>
      </main>

      <Navigation />
    </div>
  );
}
