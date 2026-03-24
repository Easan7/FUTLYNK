import { useMemo, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, players } from "@/data/mockData";

export default function Friends() {
  const [search, setSearch] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  const friends = useMemo(() => players.filter((p) => p.id !== currentUser.id), []);
  const filtered = friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const sendRequest = (friendId: string, friendName: string) => {
    if (pendingRequests.includes(friendId)) return;
    setPendingRequests((prev) => [...prev, friendId]);
    toast.success(`Friend request sent to ${friendName}`);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#9dff3f]" />
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Friends</h1>
          </div>
          <button onClick={() => setShowAddFriend((prev) => !prev)} className="btn-primary h-9 px-3 text-xs">
            <UserPlus className="mr-1 h-4 w-4" /> {showAddFriend ? "Close" : "Add Friend"}
          </button>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8b81]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={showAddFriend ? "Search players to add" : "Search friends"}
            className="pl-9"
          />
        </div>
      </header>

      <main className="space-y-2 p-4">
        {showAddFriend && (
          <section className="surface-card">
            <h2 className="text-sm font-semibold text-[#f2f7f2]">Add Friends</h2>
            <p className="mt-1 text-xs text-[#97a49a]">Search players and send requests.</p>
            <div className="mt-3 space-y-2">
              {filtered.slice(0, 6).map((friend) => (
                <div key={friend.id} className="surface-inner flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-[#edf3ee]">{friend.name}</p>
                    <p className="mt-0.5 text-xs text-[#95a39a]">{friend.gamesPlayed} games · {friend.reliabilityScore}%</p>
                  </div>
                  <button
                    onClick={() => sendRequest(friend.id, friend.name)}
                    disabled={pendingRequests.includes(friend.id)}
                    className={pendingRequests.includes(friend.id) ? "btn-secondary text-xs" : "btn-primary text-xs"}
                  >
                    {pendingRequests.includes(friend.id) ? "Requested" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Friend List</h2>
          <div className="mt-3 space-y-2">
            {filtered.map((friend) => (
              <article key={friend.id} className="surface-inner flex items-center justify-between gap-2">
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
                    <p className="mt-0.5 text-xs text-[#95a39a]">{friend.gamesPlayed} games</p>
                  </div>
                </div>

                <SkillBadge level={friend.publicSkillBand} colored />
              </article>
            ))}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
