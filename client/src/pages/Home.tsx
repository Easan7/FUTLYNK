import { useState } from "react";
import { Link } from "wouter";
import { Bell, CalendarDays, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import { currentUser, rooms } from "@/data/mockData";
import GameCard, { type Game } from "@/components/GameCard";
import { toast } from "sonner";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";

const myUpcoming = [rooms[0], rooms[1]];
const pendingRatings = [{ id: "c1", location: "Downtown Sports Arena", date: "Mar 20" }];

export default function Home() {
  const [upcomingGames, setUpcomingGames] = useState(myUpcoming);
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
          <StatBlock variant="card" label="Reliability" value={`${currentUser.reliabilityScore}%`} />
          <StatBlock variant="card" label="Streak" value={`${currentUser.streakWeeks}w`} />
        </div>
      </header>

      <main className="space-y-3 p-4">
        {nextGame ? (
          <section className="surface-card pitch-lines relative overflow-hidden">
            <PitchOverlay variant="card" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium text-[#9eada3]">Next Match</p>
                <h2 className="mt-1 text-base font-semibold text-[#f2f7f2]">{nextGame.location}</h2>
                <p className="mt-1 text-xs text-[#9aa79e]">
                  {nextGame.date} · {nextGame.time} · ${nextGame.price}
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
                onClick={() => {
                  if (!window.confirm("Leave this game?")) return;
                  setUpcomingGames((prev) => prev.filter((g) => g.id !== nextGame.id));
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
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#f2f7f2]">Rate Players</p>
                <p className="mt-1 text-xs text-[#9aa79e]">
                  {pendingRatings[0].location} · {pendingRatings[0].date}
                </p>
              </div>
              <Link href="/feedback/c1" className="btn-primary h-9 px-3 text-xs">
                Rate Now
              </Link>
            </div>
          </section>
        )}

        <section className="surface-card pitch-lines">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-heading">Queue</h2>
            <span className="text-xs text-[#91a097]">{Math.max(0, upcomingGames.length - 1)} upcoming</span>
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
                skillLevel: room.allowedBand ?? "Hybrid",
              };

              return (
                <GameCard
                  key={room.id}
                  game={game}
                  href={`/game/${room.id}`}
                  actionLabel="Leave Game"
                  actionVariant="secondary"
                  onAction={() => {
                    if (!window.confirm("Leave this game?")) return;
                    setUpcomingGames((prev) => prev.filter((g) => g.id !== room.id));
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

        <section className="surface-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#f2f7f2]">Play With Your Group</h3>
              <p className="mt-1 text-xs text-[#9aa79e]">Check overlap slots and recommended rooms.</p>
            </div>
            <CalendarDays className="h-4 w-4 text-[#9dff3f]" />
          </div>
          <Link href="/groups" className="btn-secondary mt-3 w-full">
            Open Groups
          </Link>
        </section>

        <section className="surface-inner">
          <div className="flex items-center gap-2 text-sm text-[#cfdacf]">
            <Star className="h-4 w-4 text-[#9dff3f]" />
            Keep ratings updated for fair matching
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
