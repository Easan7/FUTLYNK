import { useMemo, useState } from "react";
import { Link } from "wouter";
import { MessageCircle, Search, Shield, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, players } from "@/data/mockData";

export default function Friends() {
  const [search, setSearch] = useState("");

  const friends = useMemo(() => players.filter((p) => p.id !== currentUser.id), []);
  const filtered = friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0b0f18] pb-24">
      <header className="border-b border-white/10 px-4 pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#a8ff3f]" />
            <h1 className="text-2xl font-semibold text-white">Friends</h1>
          </div>
          <button
            onClick={() => toast.success("Friend request flow is mocked for prototype")}
            className="rounded-xl border border-[#32415d] bg-[#111a29] px-3 py-2 text-xs font-semibold text-[#d5deec]"
          >
            <UserPlus className="mr-1 inline h-4 w-4" /> Add
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7688a6]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="border-[#2f3a51] bg-[#101726] pl-9 text-white"
          />
        </div>
      </header>

      <main className="space-y-3 p-4">
        <Link href="/groups">
          <article className="surface-card p-4">
            <p className="text-sm font-semibold text-white">Build a coordination group</p>
            <p className="mt-1 text-xs text-[#9caec9]">Aggregate availability and find best-fit released games in one tap.</p>
          </article>
        </Link>

        {filtered.map((friend) => (
          <article key={friend.id} className="surface-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b2538] text-sm font-semibold text-white">
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {friend.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#131b2a] bg-[#a8ff3f]" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{friend.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <SkillBadge level={friend.publicSkillBand} colored />
                    <span className="text-xs text-[#9fb1cd]">{friend.gamesPlayed} games</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#8ea1be]">Reliability</p>
                <p className="text-sm font-semibold text-[#a8ff3f]">{friend.reliabilityScore}%</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {friend.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#33425d] bg-[#0f1726] px-2 py-1 text-[11px] text-[#c3d0e2]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => toast.info(`Mock message sent to ${friend.name}`)}
                className="flex-1 rounded-xl bg-[#182133] py-2 text-xs font-semibold text-[#d7e1f0]"
              >
                <MessageCircle className="mr-1 inline h-4 w-4" /> Message
              </button>
              <button
                onClick={() => toast.info(`${friend.name} muted in prototype`)}
                className="rounded-xl border border-[#394764] px-3 py-2 text-xs font-semibold text-[#d0dbee]"
              >
                <Shield className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </main>

      <Navigation />
    </div>
  );
}
