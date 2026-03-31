import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Search, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import SkillBadge from "@/components/SkillBadge";
import type { SkillLevel } from "@/components/SkillBadge";
import { apiGet, apiPost, getCurrentUserId } from "@/lib/api";

const toSkillLevel = (value: string): SkillLevel =>
  value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Hybrid"
    ? value
    : "Hybrid";

type FriendOption = {
  id: string;
  name: string;
  gamesPlayed: number;
  publicSkillBand: string;
};

export default function CreateGroup() {
  const currentUserId = getCurrentUserId();
  const [, setLocation] = useLocation();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [nameError, setNameError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [availableFriends, setAvailableFriends] = useState<FriendOption[]>([]);
  const [currentUserName, setCurrentUserName] = useState("You");
  const [currentUserSkillBand, setCurrentUserSkillBand] = useState("Intermediate");

  useEffect(() => {
    const loadFriends = async () => {
      const [friendsPayload, profilePayload] = await Promise.all([
        apiGet<{ friends: any[] }>(`/api/v1/friends?user_id=${currentUserId}`),
        apiGet<{ profile: { displayName: string; publicSkillBand: string } }>(`/api/v1/profile?user_id=${currentUserId}`),
      ]);
      setCurrentUserName(profilePayload.profile.displayName || "You");
      setCurrentUserSkillBand(profilePayload.profile.publicSkillBand || "Intermediate");
      const payload = friendsPayload;
      const options = (payload.friends ?? [])
        .filter((f) => f.isFriend)
        .map((f) => ({
          id: f.id,
          name: f.name,
          gamesPlayed: f.gamesPlayed,
          publicSkillBand: f.publicSkillBand,
        }));
      setAvailableFriends(options);
    };

    void loadFriends();
  }, [currentUserId]);

  const filtered = useMemo(
    () =>
      availableFriends.filter(
        (f) => f.name.toLowerCase().includes(search.toLowerCase()) && !selectedIds.includes(f.id)
      ),
    [availableFriends, search, selectedIds]
  );

  const selectedMembers = selectedIds
    .map((id) => availableFriends.find((f) => f.id === id))
    .filter(Boolean) as FriendOption[];

  const createGroup = async () => {
    setNameError("");
    setMemberError("");
    if (!groupName.trim()) {
      setNameError("Enter a group name.");
    }
    if (selectedMembers.length === 0) {
      setMemberError("Add at least one member.");
    }
    if (!groupName.trim() || selectedMembers.length === 0) {
      toast.error("Fix the highlighted fields");
      return;
    }

    await apiPost("/api/v1/groups", {
      user_id: currentUserId,
      name: groupName,
      member_ids: selectedMembers.map((m) => m.id),
    });

    toast.success(`Group \"${groupName}\" created`);
    setLocation("/groups?created=1");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center gap-3">
          <Link href="/groups" className="btn-secondary !min-h-10 !px-3" aria-label="Back to groups">
            <ArrowLeft className="h-4 w-4" />
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
            onChange={(e) => {
              setGroupName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="Friday Core"
            className="mt-2"
          />
          {nameError ? <p className="mt-2 text-xs text-[#d8a9a9]">{nameError}</p> : null}
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
                    <SkillBadge level={toSkillLevel(friend.publicSkillBand)} colored />
                    <UserPlus className="h-4 w-4 text-[#9dff3f]" />
                  </div>
                </button>
              ))}
            </div>
          )}
          {memberError ? <p className="mt-2 text-xs text-[#d8a9a9]">{memberError}</p> : null}
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Selected Members</h2>
          <div className="mt-3 space-y-2">
            {[{ id: currentUserId, name: `${currentUserName} (You)`, publicSkillBand: currentUserSkillBand }, ...selectedMembers].map((member) => (
              <div key={member.id} className="surface-inner flex items-center justify-between gap-2">
                <span className="text-sm text-[#e9f0ea]">{member.name}</span>
                <div className="flex items-center gap-2">
                  <SkillBadge level={toSkillLevel(member.publicSkillBand)} colored />
                  {member.id !== currentUserId ? (
                    <button
                      onClick={() => setSelectedIds((prev) => prev.filter((id) => id !== member.id))}
                      className="btn-secondary !min-h-8 !px-2"
                      aria-label={`Remove ${member.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => void createGroup()} className="btn-primary w-full" disabled={!groupName.trim()}>
          Create Group
        </button>
      </main>

      <Navigation />
    </div>
  );
}
