import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Flag, Lock, Star } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { completedGameFeedback } from "@/data/mockData";
import { awardGameCompletion } from "@/lib/playerProgress";

export default function PostGameFeedback() {
  const params = useParams<{ gameId: string }>();
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const game = params?.gameId === completedGameFeedback.id ? completedGameFeedback : null;

  const splitPlayers = useMemo(() => {
    if (!game) return { eligible: [], sameGroup: [] };

    const eligible = game.players.filter((p) => p.joinedViaGroupId !== game.currentUserJoinGroupId);
    const sameGroup = game.players.filter((p) => p.joinedViaGroupId === game.currentUserJoinGroupId);

    return { eligible, sameGroup };
  }, [game]);

  const submit = () => {
    if (!game) return;
    if (Object.keys(ratings).length < splitPlayers.eligible.length) {
      toast.error(`Please rate all eligible players (${splitPlayers.eligible.length})`);
      return;
    }
    const reward = awardGameCompletion(game.id, 50);
    if (reward.awarded) {
      toast.success("Ratings submitted", {
        description: "+50 points added to your rewards balance.",
      });
      return;
    }
    toast.success("Ratings submitted", {
      description: "Points for this match were already claimed.",
    });
  };

  if (!game) {
    return (
      <div className="app-shell">
        <div className="p-4">
          <p className="text-[#edf3ee]">Game feedback unavailable.</p>
          <Link href="/" className="btn-primary mt-3">
            Back to My Games
          </Link>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center gap-3">
          <Link href="/" className="btn-secondary !min-h-10 !px-3" aria-label="Back to games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#f2f7f2]">Rate Players</h1>
            <p className="text-xs text-[#96a39a]">
              {game.location} · {game.date}
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Match Summary</h2>
          <p className="mt-1 text-xs text-[#97a49b]">Give fair ratings based on this match only.</p>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Players</h2>
          <div className="mt-3 space-y-2">
            {splitPlayers.eligible.map((player) => (
              <article key={player.id} className="surface-inner">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 border border-[#2b342d]">
                      <AvatarFallback className="bg-[#1d261f] text-xs text-[#eaf0ea]">
                        {player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-[#edf3ee]">{player.name}</p>
                  </div>

                  <button
                    onClick={() => toast.info(`Flag flow for ${player.name} is mocked`)}
                    className="chip"
                  >
                    <Flag className="mr-1 h-3 w-3" /> Sportsmanship
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRatings((prev) => ({ ...prev, [player.id]: star }))}>
                      <Star
                        className={`h-6 w-6 ${ratings[player.id] >= star ? "fill-[#9dff3f] text-[#9dff3f]" : "text-[#4d5a51]"}`}
                      />
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Not Rateable</h2>
          <div className="mt-3 space-y-2">
            {splitPlayers.sameGroup.map((player) => (
              <div key={player.id} className="surface-inner flex items-center justify-between">
                <p className="text-sm text-[#d8e1da]">{player.name}</p>
                <span className="chip">
                  <Lock className="mr-1 h-3 w-3" /> Same group
                </span>
              </div>
            ))}
          </div>
        </section>

        <button onClick={submit} className="btn-primary w-full">
          Submit Feedback
        </button>
      </main>

      <Navigation />
    </div>
  );
}
