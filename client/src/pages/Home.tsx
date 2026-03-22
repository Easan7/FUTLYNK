import { useState } from "react";
import { Link } from "wouter";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, getAllowedRoomsForUser, getFitLabel, getRoomFitScore, rooms } from "@/data/mockData";
import AppHero from "@/components/AppHero";
import GameCard, { type Game } from "@/components/GameCard";
import { toast } from "sonner";

const myUpcoming = [rooms[0], rooms[1]];
const pendingRatings = [{ id: "c1", location: "Downtown Sports Arena", date: "Mar 20" }];

export default function Home() {
  const [upcomingGames, setUpcomingGames] = useState(myUpcoming);
  const recommended = getAllowedRoomsForUser(currentUser.publicSkillBand)
    .map((room) => {
      const fitScore = getRoomFitScore(currentUser.hiddenSkillRating, room);
      return { room, fitScore, fitLabel: getFitLabel(fitScore) };
    })
    .sort((a, b) => b.fitScore - a.fitScore)[0];

  return (
    <div className="min-h-screen bg-[#0b0f18] pb-24">
      <header className="border-b border-white/10 px-4 pb-5 pt-6">
        <AppHero
          className="mb-4 h-[184px]"
          kicker="FutLynk command board"
          title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
          subtitle="Your tactical view for fit-rated rooms, squad coordination, and next best match."
          badge="Live fit engine"
        />

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea2bf]">Upcoming</p>
            <p className="mt-1 text-lg font-semibold text-white">{upcomingGames.length}</p>
          </div>
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea2bf]">Reliability</p>
            <p className="mt-1 text-lg font-semibold text-[#a8ff3f]">{currentUser.reliabilityScore}%</p>
          </div>
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea2bf]">Streak</p>
            <p className="mt-1 text-lg font-semibold text-white">{currentUser.streakWeeks}w</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4">
        {pendingRatings.length > 0 && (
          <section className="surface-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Action needed</p>
                <p className="mt-1 text-xs text-[#9db0cb]">Submit post-game ratings to keep matching fair.</p>
              </div>
              <AlertCircle className="h-4 w-4 text-[#ffd577]" />
            </div>
            <Link href="/feedback/c1">
              <button className="mt-3 rounded-xl bg-[#a8ff3f] px-3 py-2 text-xs font-semibold text-[#11190f]">
                Rate now
              </button>
            </Link>
          </section>
        )}

        {recommended && (
          <section className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#a8ff3f]">Recommended next game</p>
            <h2 className="mt-1 text-base font-semibold text-white">{recommended.room.title}</h2>
            <p className="mt-1 text-xs text-[#9db0cc]">{recommended.fitLabel} · {recommended.room.location} · {recommended.room.date}</p>
            <div className="mt-3 flex items-center justify-between">
              {recommended.room.allowedBand === null ? <SkillBadge level="Hybrid" colored /> : <SkillBadge level={recommended.room.allowedBand} colored />}
              <Link href={`/game/${recommended.room.id}?source=matchmaking`}>
                <button className="rounded-xl bg-[#1b2638] px-3 py-1.5 text-xs font-semibold text-[#d8e3f2]">
                  View room <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </section>
        )}

        <section className="surface-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#cfd8e7]">Upcoming Games</h2>
            <p className="text-xs text-[#8d9db6]">{upcomingGames.length} joined</p>
          </div>
          <div className="space-y-3">
            {upcomingGames.map((room) => {
              const game: Game = {
                id: room.id,
                location: room.location,
                date: room.date,
                time: room.time,
                playersJoined: room.playersJoined,
                maxPlayers: room.maxPlayers,
                price: room.price,
                skillLevel: room.allowedBand ?? "Hybrid",
              };

              return (
                <GameCard
                  key={room.id}
                  game={game}
                  href={`/game/${room.id}`}
                  actionLabel="Leave Game"
                  onAction={() => {
                    setUpcomingGames((prev) => prev.filter((g) => g.id !== room.id));
                    toast.success("You left this game");
                  }}
                />
              );
            })}
            {upcomingGames.length === 0 && (
              <p className="rounded-2xl border border-[#273247] bg-[#121824] p-3 text-sm text-[#9aa8bf]">
                No upcoming joined games.
              </p>
            )}
          </div>
        </section>

        <section className="surface-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CheckCircle2 className="h-4 w-4 text-[#a8ff3f]" /> Play again with recent squad
          </div>
          <p className="mt-1 text-xs text-[#97a9c5]">Invite your most-played teammates to the next best-fit released room.</p>
          <Link href="/groups">
            <button className="mt-3 rounded-xl bg-[#1b2638] px-3 py-2 text-xs font-semibold text-[#d8e2f2]">Open group recommendations</button>
          </Link>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
