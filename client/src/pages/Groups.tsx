import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageSquare, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import PitchOverlay from "@/components/PitchOverlay";
import ProgressRing from "@/components/ProgressRing";
import { apiGet, apiPost, DEFAULT_USER_ID } from "@/lib/api";

type GroupCard = {
  id: string;
  name: string;
  memberCount: number;
  topOverlap: string;
};

type GroupDetail = {
  group: { id: string; name: string; memberIds: string[] };
  members: Array<{ id: string; name: string; publicSkillBand: string }>;
  overlapSlots: Array<{ slot: string; count: number }>;
  recommendations: Array<{ room: any; fitScore: number }>;
  chat: Array<{ id: string; user: string; text: string }>;
};

export default function Groups() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [groups, setGroups] = useState<GroupCard[]>([]);
  const [detail, setDetail] = useState<GroupDetail | null>(null);

  const loadGroups = async () => {
    try {
      const payload = await apiGet<{ groups: GroupCard[] }>(`/api/v1/groups?user_id=${DEFAULT_USER_ID}`);
      setGroups(payload.groups ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load groups");
    }
  };

  const loadDetail = async (groupId: string) => {
    try {
      const payload = await apiGet<GroupDetail>(`/api/v1/groups/${groupId}?user_id=${DEFAULT_USER_ID}`);
      setDetail(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load group details");
    }
  };

  useEffect(() => {
    void loadGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroupId) {
      setDetail(null);
      return;
    }
    void loadDetail(selectedGroupId);
  }, [selectedGroupId]);

  const groupCards = useMemo(
    () =>
      groups.map((group) => ({
        group,
        skill: { profile: "Mixed" },
        overlap: { slot: group.topOverlap },
      })),
    [groups]
  );

  const sendChat = async () => {
    if (!selectedGroupId || !chatMessage.trim()) return;
    await apiPost(`/api/v1/groups/${selectedGroupId}/chat`, { user_id: DEFAULT_USER_ID, text: chatMessage });
    setChatMessage("");
    await loadDetail(selectedGroupId);
  };

  if (selectedGroupId) {
    if (!detail) {
      return (
        <div className="app-shell">
          <main className="p-4 text-sm text-[#9aa79e]">Loading group...</main>
          <Navigation />
        </div>
      );
    }

    const selectedGroup = detail.group;
    const overlapSlots = detail.overlapSlots;
    const recommendations = detail.recommendations;
    const members = detail.members;

    return (
      <div className="app-shell">
        <header className="app-header">
          <PitchOverlay variant="header" />
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedGroupId(null)} className="btn-secondary relative z-10 !px-3">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="relative z-10">
              <h1 className="text-xl font-semibold text-[#f2f7f2]">{selectedGroup.name}</h1>
            </div>
          </div>
        </header>

        <main className="space-y-3 p-4">
          <section className="surface-card pitch-lines">
            <h2 className="text-sm font-semibold text-[#f2f7f2]">Group Summary</h2>
            <div className="mt-3 flex -space-x-2">
              {members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#101510] bg-[#202720] text-xs text-[#e7eee8]"
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#99a69d]">Skill profile: Mixed</p>
          </section>

          <section className="surface-card">
            <h3 className="text-sm font-semibold text-[#f2f7f2]">Availability Overlap</h3>
            <div className="mt-3 space-y-2">
              {overlapSlots.map((slot) => (
                <div key={slot.slot} className="surface-inner flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#dce6de]">{slot.slot}</span>
                      <span className="text-[#9dff3f]">
                        {slot.count}/{selectedGroup.memberIds.length}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#252d27]">
                      <div
                        className="h-full rounded-full bg-[#9dff3f]"
                        style={{ width: `${(slot.count / selectedGroup.memberIds.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <ProgressRing
                    size="sm"
                    value={slot.count / selectedGroup.memberIds.length}
                    label={`${Math.round((slot.count / selectedGroup.memberIds.length) * 100)}`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card">
            <h3 className="text-sm font-semibold text-[#f2f7f2]">Recommended Games</h3>
            <div className="mt-3 space-y-2">
              {recommendations.map((item) => (
                <div key={item.room.id} className="surface-inner">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#edf3ee]">{item.room.location}</p>
                      <p className="mt-1 text-xs text-[#98a69d]">
                        {item.room.date} · {item.room.time} · ${item.room.price}
                      </p>
                    </div>
                    {item.room.allowedBand ? <SkillBadge level={item.room.allowedBand} colored /> : <SkillBadge level="Hybrid" colored />}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => void loadDetail(selectedGroupId)} className="btn-primary mt-3 w-full">
              Refresh Recommendations
            </button>
          </section>

          <section className="surface-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#f2f7f2]">Group Chat</h3>
              <MessageSquare className="h-4 w-4 text-[#94a299]" />
            </div>
            <div className="space-y-2">
              {detail.chat.map((msg) => (
                <div key={msg.id} className="surface-inner text-xs text-[#d8e2da]">
                  <span className="font-semibold text-[#eff5ef]">{msg.user}:</span> {msg.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Message group" />
              <button onClick={() => void sendChat()} className="btn-secondary">
                Send
              </button>
            </div>
          </section>
        </main>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Groups</h1>
            <p className="mt-1 text-xs text-[#96a39a]">Lightweight squads for planning games.</p>
          </div>
          <Link href="/create" className="btn-primary relative z-10 h-10 px-3 text-xs">
            <Plus className="mr-1 h-4 w-4" /> Create
          </Link>
        </div>
      </header>

      <main className="space-y-3 p-4">
        {groupCards.map(({ group, skill, overlap }) => (
          <button key={group.id} onClick={() => setSelectedGroupId(group.id)} className="surface-card w-full text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#f2f7f2]">{group.name}</h2>
                <p className="mt-1 text-xs text-[#98a69d]">{group.memberCount} members</p>
              </div>
              <span className="chip">{skill.profile}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#9aa89f]">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                Next overlap
              </span>
              <span>{overlap?.slot ?? "Pending"}</span>
            </div>
          </button>
        ))}
      </main>

      <Navigation />
    </div>
  );
}
