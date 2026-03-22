import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, players } from "@/data/mockData";

export default function CreateGroup() {
  const [, setLocation] = useLocation();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const availableFriends = players.filter((p) => p.id !== currentUser.id);

  const filtered = useMemo(
    () =>
      availableFriends.filter(
        (f) => f.name.toLowerCase().includes(search.toLowerCase()) && !selectedIds.includes(f.id)
      ),
    [availableFriends, search, selectedIds]
  );

  const selectedMembers = selectedIds
    .map((id) => availableFriends.find((f) => f.id === id))
    .filter(Boolean);

  const skillProfile = useMemo(() => {
    const all = [currentUser.publicSkillBand, ...selectedMembers.map((m) => m!.publicSkillBand)];
    const unique = new Set(all);
    return unique.size > 1 ? "Mixed" : "Same-level";
  }, [selectedMembers]);

  const createGroup = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error("Add at least one member");
      return;
    }

    toast.success(`Group \"${groupName}\" created`, {
      description: "We will use your group's availability and skill mix to recommend released games.",
    });
    setTimeout(() => setLocation("/groups?created=1"), 500);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] pb-24">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0d14]/95 px-4 pb-4 pt-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/groups">
            <button className="rounded-xl border border-[#2a3448] bg-[#101624] p-2 text-[#c8d4e7]">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Create Group</h1>
            <p className="text-xs text-[#91a3c0]">Flexible size. Designed for coordination, not booking.</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4">
        <section className="surface-card p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#8ea1be]">Group name</label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Thursday Recovery Squad"
            className="mt-2 border-[#2e3950] bg-[#0f1624] text-white"
          />
        </section>

        <section className="surface-card p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#8ea1be]">Add members</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7586a4]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends"
              className="border-[#2e3950] bg-[#0f1624] pl-9 text-white"
            />
          </div>

          {search && (
            <div className="mt-3 space-y-2">
              {filtered.slice(0, 5).map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => {
                    setSelectedIds((prev) => [...prev, friend.id]);
                    setSearch("");
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-[#0f1624] p-3 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{friend.name}</p>
                    <p className="text-xs text-[#9bb0cc]">{friend.gamesPlayed} games · {friend.reliabilityScore}% reliability</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SkillBadge level={friend.publicSkillBand} colored />
                    <UserPlus className="h-4 w-4 text-[#a8ff3f]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="surface-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Group composition</h2>
            <span className="text-xs text-[#95a8c4]">{selectedMembers.length + 1} members</span>
          </div>

          <div className="space-y-2">
            {[{ ...currentUser, name: `${currentUser.name} (You)` }, ...selectedMembers].map((member) => (
              <div key={member!.id} className="flex items-center justify-between rounded-2xl bg-[#101624] p-2.5">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-[#2d3850]">
                    <AvatarFallback className="bg-[#1a2538] text-xs text-white">
                      {member!.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white">{member!.name}</span>
                </div>
                <SkillBadge level={member!.publicSkillBand} colored />
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-[#101624] p-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <Users className="h-4 w-4 text-[#a8ff3f]" />
              {skillProfile} squad
            </div>
            <p className="mt-1 text-xs text-[#9bb0cc]">
              We'll use your group's availability and skill mix to recommend the best released games.
            </p>
          </div>
        </section>

        <button
          onClick={createGroup}
          className="w-full rounded-2xl bg-[#a8ff3f] py-3 text-sm font-semibold text-[#121a0f]"
        >
          Create Group
        </button>
      </main>

      <Navigation />
    </div>
  );
}
