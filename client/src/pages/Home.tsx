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

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <p className="text-[11px] text-[#93a299]">Welcome back</p>
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">My Games</h1>
          </div>
          <Link href="/notifications">
            <button className="btn-secondary relative z-10 !px-3">
              <Bell className="h-4 w-4" />
            </button>
          </Link>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-3 gap-2">
          <StatBlock variant="card" label="Joined" value={upcomingGames.length} />
          <StatBlock variant="card" label="Reliability" value={`${currentUser.reliabilityScore}%`} />
          <StatBlock variant="card" label="Streak" value={`${currentUser.streakWeeks}w`} />
        </div>
      </header>

      <main className="space-y-3 p-4">
        {pendingRatings.length > 0 && (
          <section className="surface-card">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#f2f7f2]">Rate Players</p>
                <p className="mt-1 text-xs text-[#9aa79e]">
                  {pendingRatings[0].location} · {pendingRatings[0].date}
                </p>
              </div>
              <Link href="/feedback/c1">
                <button className="btn-primary h-9 px-3 text-xs">Rate Now</button>
              </Link>
            </div>
          </section>
        )}

        <section className="surface-card pitch-lines">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-heading">Upcoming Games</h2>
            <span className="text-xs text-[#91a097]">{upcomingGames.length} joined</span>
          </div>
          <PitchOverlay variant="divider" className="mb-3" />

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
                  actionVariant="secondary"
                  onAction={() => {
                    setUpcomingGames((prev) => prev.filter((g) => g.id !== room.id));
                    toast.success("You left this game");
                  }}
                />
              );
            })}

            {upcomingGames.length === 0 && (
              <p className="surface-inner text-sm text-[#9aa79e]">No upcoming games joined yet.</p>
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
          <Link href="/groups">
            <button className="btn-secondary mt-3 w-full">Open Groups</button>
          </Link>
        </section>

        <section className="surface-card">
          <div className="flex items-center gap-2 text-sm text-[#dce6df]">
            <Star className="h-4 w-4 text-[#9dff3f]" />
            Keep ratings updated for fair matching
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
