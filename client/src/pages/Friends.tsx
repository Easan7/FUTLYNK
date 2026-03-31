import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import { Input } from "@/components/ui/input";
import SkillBadge from "@/components/SkillBadge";
import type { SkillLevel } from "@/components/SkillBadge";
import PitchOverlay from "@/components/PitchOverlay";
import { apiGet, apiPost, getCurrentUserId } from "@/lib/api";

const toSkillLevel = (value: string): SkillLevel =>
  value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Hybrid"
    ? value
    : "Hybrid";

type Friend = {
  id: string;
  name: string;
  publicSkillBand: string;
  reliabilityScore: number;
  gamesPlayed: number;
  isOnline: boolean;
  isFriend: boolean;
  requestPending: boolean;
  requestDirection?: "incoming" | "outgoing" | null;
};

export default function Friends() {
  const currentUserId = getCurrentUserId();
  const [search, setSearch] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [people, setPeople] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Friend[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (q = "") => {
    try {
      setLoading(true);
      const payload = await apiGet<{ friends: Friend[]; incomingRequests?: Friend[]; outgoingRequests?: Friend[] }>(
        `/api/v1/friends?user_id=${currentUserId}&q=${encodeURIComponent(q)}`
      );
      setPeople(payload.friends ?? []);
      setIncomingRequests(payload.incomingRequests ?? []);
      setOutgoingRequests(payload.outgoingRequests ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAddFriend && !search.trim()) {
      setPeople([]);
      return;
    }
    const timeout = window.setTimeout(() => {
      void load(search);
    }, 180);
    return () => window.clearTimeout(timeout);
  }, [search, showAddFriend]);

  const friends = useMemo(() => people.filter((p) => p.isFriend), [people]);
  const filtered = useMemo(() => {
    if (!showAddFriend) return friends;
    if (!search.trim()) return [];
    return people.filter((p) => !p.isFriend);
  }, [friends, people, search, showAddFriend]);

  const sendRequest = async (friendId: string, friendName: string) => {
    await apiPost("/api/v1/friends/requests", { user_id: currentUserId, friend_id: friendId });
    toast.success(`Friend request sent to ${friendName}`);
    await load(search);
  };

  const respondToRequest = async (friendId: string, action: "accept" | "reject", friendName: string) => {
    await apiPost(`/api/v1/friends/requests/${friendId}/respond`, { user_id: currentUserId, action });
    toast.success(action === "accept" ? `You are now friends with ${friendName}` : `Request from ${friendName} declined`);
    await load(search);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between gap-2">
          <div className="relative z-10 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#9dff3f]" />
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Friends</h1>
          </div>
          <button
            onClick={() => setShowAddFriend((prev) => !prev)}
            className="btn-primary relative z-10 h-9 px-3 text-xs"
          >
            <UserPlus className="mr-1 h-4 w-4" /> {showAddFriend ? "Close" : "Add Friend"}
          </button>
        </div>

        <div className="relative z-10 mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8b81]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={showAddFriend ? "Search players to add" : "Search friends"}
            className="pl-9"
          />
        </div>
      </header>

      <main className="space-y-3 p-4">
        {loading && !showAddFriend ? <FootballLoader label="Loading friends..." /> : null}
        {!showAddFriend && (
          <section className="surface-card">
            <h2 className="text-base font-semibold text-[#f2f7f2]">Friend Requests</h2>
            <div className="mt-3 space-y-2">
              {incomingRequests.length === 0 ? (
                <div className="surface-inner">
                  <p className="text-sm text-[#95a39a]">No incoming requests right now.</p>
                </div>
              ) : (
                incomingRequests.map((request) => (
                  <div key={request.id} className="surface-inner flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-[#edf3ee]">{request.name}</p>
                      <p className="mt-0.5 text-sm text-[#95a39a]">{request.gamesPlayed} games</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary text-xs" onClick={() => void respondToRequest(request.id, "reject", request.name)}>
                        Decline
                      </button>
                      <button className="btn-primary text-xs" onClick={() => void respondToRequest(request.id, "accept", request.name)}>
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {outgoingRequests.length > 0 ? (
              <div className="mt-3 border-t border-[#27322a] pt-3">
                <p className="text-xs uppercase tracking-[0.08em] text-[#9aa79e]">Pending sent</p>
                <div className="mt-2 space-y-2">
                  {outgoingRequests.map((request) => (
                    <div key={request.id} className="surface-inner flex items-center justify-between">
                      <p className="text-sm text-[#d8e1da]">{request.name}</p>
                      <span className="chip">Pending</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        )}
        {showAddFriend && (
          <section className="surface-card">
            <h2 className="text-base font-semibold text-[#f2f7f2]">Add Friends</h2>
            <p className="mt-1 text-sm text-[#97a49a]">Search players and send requests.</p>
            <div className="mt-3 space-y-2">
              {filtered.slice(0, 8).map((friend) => (
                <div
                  key={friend.id}
                  className="surface-inner flex items-center justify-between gap-2 border-[#324136] bg-[#172019] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#465c49]"
                >
                  <div>
                    <p className="text-sm text-[#edf3ee]">{friend.name}</p>
                    <p className="mt-0.5 text-sm text-[#95a39a]">{friend.gamesPlayed} games · {friend.reliabilityScore}%</p>
                  </div>
                  <button
                    onClick={() => void sendRequest(friend.id, friend.name)}
                    disabled={friend.requestPending || friend.isFriend || friend.requestDirection === "incoming"}
                    className={friend.requestPending || friend.isFriend || friend.requestDirection === "incoming" ? "btn-secondary text-xs" : "btn-primary text-xs"}
                  >
                    {friend.isFriend ? "Friend" : friend.requestDirection === "incoming" ? "Incoming" : friend.requestPending ? "Requested" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {!showAddFriend && (
          <section className="surface-card">
          <h2 className="text-base font-semibold text-[#f2f7f2]">Friend List</h2>
          <div className="mt-3 space-y-2">
            {friends.map((friend) => (
              <article
                key={friend.id}
                className="surface-inner flex items-center justify-between gap-2 border-[#2f3b32] bg-[#161f18] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#435646]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#202820] text-sm font-semibold text-[#eef3ef]">
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {friend.isOnline && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#9dff3f]" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#edf3ee]">{friend.name}</p>
                    <p className="mt-0.5 text-sm text-[#95a39a]">{friend.gamesPlayed} games</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SkillBadge level={toSkillLevel(friend.publicSkillBand)} colored />
                  <Link href={`/profile/${friend.id}`} className="btn-secondary text-[11px]">
                    View Profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
          </section>
        )}
      </main>

      <Navigation />
    </div>
  );
}
