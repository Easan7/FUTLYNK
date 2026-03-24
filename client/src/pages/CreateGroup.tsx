import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
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

  const createGroup = () => {
    if (!groupName.trim()) {
      toast.error("Enter a group name");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error("Add at least one member");
      return;
    }

    toast.success(`Group \"${groupName}\" created`);
    setTimeout(() => setLocation("/groups?created=1"), 500);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center gap-3">
          <Link href="/groups">
            <button className="btn-secondary !px-3">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#f2f7f2]">Create Group</h1>
            <p className="text-xs text-[#95a39a]">Add friends and start coordinating.</p>
          </div>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card">
          <label className="text-xs text-[#93a198]">Group name</label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Friday Core"
            className="mt-2"
          />
        </section>

        <section className="surface-card">
          <label className="text-xs text-[#93a198]">Add members</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7e8d82]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends"
              className="pl-9"
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
                  className="surface-inner flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm text-[#edf3ee]">{friend.name}</p>
                    <p className="text-xs text-[#95a39a]">{friend.gamesPlayed} games</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SkillBadge level={friend.publicSkillBand} colored />
                    <UserPlus className="h-4 w-4 text-[#9dff3f]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Selected Members</h2>
          <div className="mt-3 space-y-2">
            {[{ ...currentUser, name: `${currentUser.name} (You)` }, ...selectedMembers].map((member) => (
              <div key={member!.id} className="surface-inner flex items-center justify-between">
                <span className="text-sm text-[#e9f0ea]">{member!.name}</span>
                <SkillBadge level={member!.publicSkillBand} colored />
              </div>
            ))}
          </div>
        </section>

        <button onClick={createGroup} className="btn-primary w-full">
          Create Group
        </button>
      </main>

      <Navigation />
    </div>
  );
}
