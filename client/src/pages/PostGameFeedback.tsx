import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { completedGameFeedback } from "@/data/mockData";

export default function PostGameFeedback() {
  const params = useParams<{ gameId: string }>();
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const game = params?.gameId === completedGameFeedback.id ? completedGameFeedback : null;

  const splitPlayers = useMemo(() => {
    if (!game) return { eligible: [], sameGroup: [] };

    const eligible = game.players.filter(
      (p) => p.joinedViaGroupId !== game.currentUserJoinGroupId
    );
    const sameGroup = game.players.filter(
      (p) => p.joinedViaGroupId === game.currentUserJoinGroupId
    );

    return { eligible, sameGroup };
  }, [game]);

  const submit = () => {
    if (!game) return;

    if (Object.keys(ratings).length < splitPlayers.eligible.length) {
      toast.error(`Please rate all eligible players (${splitPlayers.eligible.length})`);
      return;
    }

    toast.success("Feedback submitted", {
      description: "Thanks. This helps keep room balancing fair.",
    });
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-[#0a0d14] pb-24">
        <div className="p-6">
          <p className="text-white">Game feedback unavailable.</p>
          <Link href="/">
            <button className="mt-3 rounded-xl bg-[#a8ff3f] px-3 py-2 text-sm font-semibold text-[#11190f]">Back home</button>
          </Link>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] pb-24">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0d14]/95 px-4 pb-4 pt-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="rounded-xl border border-[#2a3448] bg-[#101624] p-2 text-[#c6d3e6]">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Post-game feedback</h1>
            <p className="text-xs text-[#93a5c2]">{game.location} · {game.date} · {game.time}</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4">
        <section className="surface-card p-4">
          <p className="text-sm font-semibold text-white">Fair rating rule</p>
          <p className="mt-1 text-xs text-[#9db0cc]">
            To protect rating integrity, players who joined through your same group cannot be rated by you.
          </p>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-semibold text-white">Rate eligible players</h2>
          <div className="mt-3 space-y-3">
            {splitPlayers.eligible.map((player) => (
              <article key={player.id} className="rounded-2xl bg-[#101624] p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9 border border-[#2d3850]">
                    <AvatarFallback className="bg-[#1a2538] text-xs text-white">
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-white">{player.name}</p>
                </div>

                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRatings((prev) => ({ ...prev, [player.id]: star }))}>
                      <Star
                        className={`h-6 w-6 ${ratings[player.id] >= star ? "fill-[#a8ff3f] text-[#a8ff3f]" : "text-[#4b5a73]"}`}
                      />
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-semibold text-white">Players from your group (not rateable)</h2>
          <div className="mt-3 space-y-2">
            {splitPlayers.sameGroup.map((player) => (
              <div key={player.id} className="flex items-center justify-between rounded-2xl bg-[#101624] p-3">
                <p className="text-sm text-[#a8bad4]">{player.name}</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#384662] bg-[#151e30] px-2 py-1 text-[11px] text-[#b9c8dd]">
                  <Lock className="h-3.5 w-3.5" /> Same join group
                </span>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={submit}
          className="w-full rounded-2xl bg-[#a8ff3f] py-3 text-sm font-semibold text-[#121a0f]"
        >
          Submit feedback
        </button>
      </main>

      <Navigation />
    </div>
  );
}
