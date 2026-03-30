import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageSquare, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import PitchOverlay from "@/components/PitchOverlay";
import { apiGet, apiPost, DEFAULT_USER_ID } from "@/lib/api";

type GroupCard = {
  id: string;
  name: string;
  memberCount: number;
};

type GroupDetail = {
  group: { id: string; name: string; memberIds: string[] };
  summary: {
    avgReliability: number;
    skillBandSpread: { Beginner: number; Intermediate: number; Advanced: number };
    topOverlap: string;
  };
  members: Array<{ id: string; name: string; publicSkillBand: string }>;
  recommendations: Array<{
    room: any;
    fitScore: number;
    combinedScore: number;
    roomType: string;
    capacityLeft: number;
    availability: {
      canCount: number;
      cannotCount: number;
      percent: number;
      canNames: string[];
      cannotNames: string[];
    };
    interest: {
      interestedNames: string[];
      pendingNames: string[];
      interestedCount: number;
      neededCount: number;
      isReady: boolean;
      currentUserInterested: boolean;
      currentUserEligible: boolean;
    };
  }>;
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
      })),
    [groups]
  );

  const sendChat = async () => {
    if (!selectedGroupId || !chatMessage.trim()) return;
    await apiPost(`/api/v1/groups/${selectedGroupId}/chat`, { user_id: DEFAULT_USER_ID, text: chatMessage });
    setChatMessage("");
    await loadDetail(selectedGroupId);
  };

  const setRecommendationInterest = async (roomId: string, wantsToJoin: boolean) => {
    if (!selectedGroupId) return;
    try {
      const payload = await apiPost<{ autoJoined?: boolean; interestedCount?: number; neededCount?: number }>(
        `/api/v1/groups/${selectedGroupId}/recommendations/${roomId}/interest`,
        { user_id: DEFAULT_USER_ID, wants_to_join: wantsToJoin }
      );
      if (payload.autoJoined) {
        toast.success("All available members confirmed. Group auto-joined this room.");
      } else {
        toast.success(wantsToJoin ? "Marked as available for this room." : "Removed your availability mark.");
      }
      await loadDetail(selectedGroupId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update recommendation interest");
    }
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
    const recommendations = detail.recommendations;
    const members = detail.members;
    const summary = detail.summary;

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
            <div className="mt-3 rounded-xl border border-[#2d352f] bg-[#121814] p-3">
              <p className="text-[11px] text-[#95a39a]">Skill Spread</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-center">
                  <p className="text-[#95a39a]">Beginner</p>
                  <p className="mt-1 text-sm font-semibold text-[#e9f1ea]">{summary.skillBandSpread.Beginner}</p>
                </div>
                <div className="rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-center">
                  <p className="text-[#95a39a]">Intermediate</p>
                  <p className="mt-1 text-sm font-semibold text-[#e9f1ea]">{summary.skillBandSpread.Intermediate}</p>
                </div>
                <div className="rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-center">
                  <p className="text-[#95a39a]">Advanced</p>
                  <p className="mt-1 text-sm font-semibold text-[#e9f1ea]">{summary.skillBandSpread.Advanced}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-xs">
                <span className="text-[#95a39a]">Group Reliability</span>
                <span className="font-semibold text-[#e9f1ea]">{summary.avgReliability}%</span>
              </div>
            </div>
          </section>

          <section className="surface-card">
            <h3 className="text-sm font-semibold text-[#f2f7f2]">Recommended Games</h3>
            <div className="mt-3 space-y-3">
              {recommendations.map((item) => (
                <div key={item.room.id} className="rounded-2xl border border-[#2e3a31] bg-[#141b16] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#edf3ee]">{item.room.location}</p>
                      <p className="mt-1 text-sm text-[#a4b2a9]">
                        {item.room.date} · {item.room.time} · ${item.room.price}
                      </p>
                      <p className="mt-1 text-xs text-[#b9c7bd]">
                        {item.room.playersJoined}/{item.room.maxPlayers} players · {item.roomType}
                      </p>
                      <div className="mt-3 rounded-xl border border-[#3a4a3f] bg-[#18211c] p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#eef5ef]">Availability Match</span>
                          <span className="rounded-full bg-[#9dff3f]/15 px-2 py-0.5 font-semibold text-[#9dff3f]">{item.availability.percent}%</span>
                        </div>
                        <div className="mt-3 h-2.5 rounded-full bg-[#28322b]">
                          <div className="h-full rounded-full bg-[#9dff3f]" style={{ width: `${item.availability.percent}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-[#b9c7bd]">
                          <span className="font-semibold text-[#9dff3f]">{item.availability.canCount}</span> can make it ·{" "}
                          <span className="font-semibold text-[#e3a5a5]">{item.availability.cannotCount}</span> can't
                        </p>
                        <p className="mt-1 text-xs text-[#9aa89f]">Can: {item.availability.canNames.join(", ") || "None"}</p>
                        <p className="mt-1 text-xs text-[#9aa89f]">Can't: {item.availability.cannotNames.join(", ") || "None"}</p>
                      </div>
                      <p className="mt-3 text-xs text-[#9aa89f]">
                        Interest: {item.interest.interestedCount}/{item.interest.neededCount} confirmed
                        {item.interest.pendingNames.length > 0 ? ` · Waiting: ${item.interest.pendingNames.join(", ")}` : ""}
                      </p>
                      {item.interest.isReady ? <p className="mt-1 text-xs font-semibold text-[#9dff3f]">Ready to auto-join</p> : null}
                    </div>
                    {item.room.allowedBand ? <SkillBadge level={item.room.allowedBand} colored /> : <SkillBadge level="Hybrid" colored />}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => void setRecommendationInterest(item.room.id, !item.interest.currentUserInterested)}
                      className={item.interest.currentUserInterested ? "btn-secondary flex-1 text-sm" : "btn-primary flex-1 text-sm"}
                      disabled={!item.interest.currentUserEligible}
                    >
                      {!item.interest.currentUserEligible
                        ? "Not Eligible"
                        : item.interest.currentUserInterested
                          ? "Unmark Availability"
                          : "I Can Make This"}
                    </button>
                    <Link href={`/game/${item.room.id}?source=group`} className="btn-secondary text-sm">
                      View
                    </Link>
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
            <p className="mt-1 text-xs text-[#96a39a]">Plan and coordinate games with your friends</p>
          </div>
          <Link href="/create" className="btn-primary relative z-10 h-10 px-3 text-xs">
            <Plus className="mr-1 h-4 w-4" /> Create
          </Link>
        </div>
      </header>

      <main className="space-y-3 p-4">
        {groupCards.map(({ group, skill }) => (
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
                Group planning board
              </span>
              <span>Open</span>
            </div>
          </button>
        ))}
      </main>

      <Navigation />
    </div>
  );
}
