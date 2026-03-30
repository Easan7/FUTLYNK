import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Flag, Lock, Star } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiGet, apiPost, DEFAULT_USER_ID } from "@/lib/api";

type FeedbackGame = {
  id: string;
  location: string;
  date: string;
  time: string;
  currentUserJoinGroupId: string | null;
  players: Array<{ id: string; name: string; joinedViaGroupId: string | null; canRate?: boolean }>;
  tagOptions?: string[];
};

export default function PostGameFeedback() {
  const params = useParams<{ gameId: string }>();
  const gameId = params?.gameId ?? "c1";
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [tagsByPlayer, setTagsByPlayer] = useState<Record<string, string[]>>({});
  const [flaggedByPlayer, setFlaggedByPlayer] = useState<Record<string, boolean>>({});
  const [game, setGame] = useState<FeedbackGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const payload = await apiGet<FeedbackGame>(`/api/v1/feedback/${gameId}?user_id=${DEFAULT_USER_ID}`);
        setGame(payload);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [gameId]);

  const splitPlayers = useMemo(() => {
    if (!game) return { eligible: [], sameGroup: [] };

    const others = game.players.filter((p) => p.id !== DEFAULT_USER_ID);
    const eligible = others.filter((p) => p.canRate === true);
    const sameGroup = others.filter((p) => p.canRate !== true);

    return { eligible, sameGroup };
  }, [game]);

  const submit = async () => {
    if (!game) return;
    if (Object.keys(ratings).length < splitPlayers.eligible.length) {
      toast.error(`Please rate all eligible players (${splitPlayers.eligible.length})`);
      return;
    }

    const payload = splitPlayers.eligible.map((player) => ({
      rated_user_id: player.id,
      stars: ratings[player.id],
      flagged_sportsmanship: Boolean(flaggedByPlayer[player.id]),
      tags: tagsByPlayer[player.id] ?? [],
    }));

    const result = await apiPost<{ awarded: boolean }>(`/api/v1/feedback/${game.id}/submit`, {
      user_id: DEFAULT_USER_ID,
      ratings: payload,
    });

    if (result.awarded) {
      toast.success("Ratings submitted", {
        description: "+50 points added to your rewards balance.",
      });
      return;
    }

    toast.success("Ratings submitted", {
      description: "Points for this match were already claimed.",
    });
  };

  if (loading && !game) {
    return (
      <div className="app-shell">
        <FootballLoader fullScreen label="Loading feedback..." />
        <Navigation />
      </div>
    );
  }

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

  const tagOptions = game.tagOptions ?? [];

  const togglePlayerTag = (playerId: string, tag: string) => {
    setTagsByPlayer((prev) => {
      const current = prev[playerId] ?? [];
      if (current.includes(tag)) {
        return { ...prev, [playerId]: current.filter((t) => t !== tag) };
      }
      if (current.length >= 3) {
        toast.error("Select up to 3 tags per player");
        return prev;
      }
      return { ...prev, [playerId]: [...current, tag] };
    });
  };

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

      <main className="space-y-4 p-4">
        <section className="surface-card">
          <h2 className="text-base font-semibold text-[#f2f7f2]">Give fair skill-based ratings for this match</h2>
        </section>

        <section className="surface-card">
          <h2 className="text-base font-semibold text-[#f2f7f2]">Players</h2>
          <div className="mt-3 space-y-2">
            {splitPlayers.eligible.length > 0 ? (
              splitPlayers.eligible.map((player) => (
                <article key={player.id} className="surface-inner border-[#2f3b32] bg-[#161f18]">
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
                      onClick={() =>
                        setFlaggedByPlayer((prev) => ({ ...prev, [player.id]: !prev[player.id] }))
                      }
                      className={
                        flaggedByPlayer[player.id]
                          ? "inline-flex items-center rounded-full border border-[#bb5f5f] bg-[#5a2f2f] px-3 py-1 text-xs font-semibold text-[#ffd4d4]"
                          : "inline-flex items-center rounded-full border border-[#7c4b4b] bg-[#3a2323] px-3 py-1 text-xs font-semibold text-[#f0d2d2]"
                      }
                    >
                      <Flag className="mr-1 h-3 w-3" />
                      {flaggedByPlayer[player.id] ? "Flagged Unsportsmanlike" : "Flag Unsportsmanlike"}
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

                  <div className="mt-3">
                    <p className="text-sm text-[#95a39a]">Assign tags (optional, up to 3)</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tagOptions.map((tag) => {
                        const active = (tagsByPlayer[player.id] ?? []).includes(tag);
                        return (
                          <button key={tag} onClick={() => togglePlayerTag(player.id, tag)} className={`chip ${active ? "chip-active" : ""}`}>
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="surface-inner">
                <p className="text-sm text-[#95a39a]">No players are eligible to rate for this game.</p>
              </div>
            )}
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-base font-semibold text-[#f2f7f2]">Not Rateable</h2>
          <div className="mt-3 space-y-2">
            {splitPlayers.sameGroup.length > 0 ? (
              splitPlayers.sameGroup.map((player) => (
                <div key={player.id} className="surface-inner flex items-center justify-between">
                  <p className="text-sm text-[#d8e1da]">{player.name}</p>
                  <span className="chip">
                    <Lock className="mr-1 h-3 w-3" /> Not rateable
                  </span>
                </div>
              ))
            ) : (
              <div className="surface-inner">
                <p className="text-sm text-[#95a39a]">Everyone in this match is rateable.</p>
              </div>
            )}
          </div>
        </section>

        <button onClick={() => void submit()} className="btn-primary w-full">
          Submit Feedback
        </button>
      </main>

      <Navigation />
    </div>
  );
}
