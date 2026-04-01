import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare, Plus } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PitchOverlay from "@/components/PitchOverlay";
import { apiGet, apiPost, getCurrentUserId } from "@/lib/api";

type GroupCard = {
  id: string;
  name: string;
  memberCount: number;
  skillProfile?: string;
};

type GroupDetail = {
  group: { id: string; name: string; memberIds: string[] };
  summary: {
    avgReliability: number;
    skillBandSpread: { Beginner: number; Intermediate: number; Advanced: number };
    topOverlap: string;
    membersWithAvailability?: number;
    recommendationNote?: string;
  };
  members: Array<{ id: string; name: string; publicSkillBand: string }>;
  upcomingGroupGames: Array<{
    room: any;
    joinedMemberIds: string[];
    joinedMemberNames: string[];
  }>;
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
      declinedNames: string[];
      pendingNames: string[];
      interestedCount: number;
      declinedCount: number;
      neededCount: number;
      isReady: boolean;
      currentUserInterested: boolean;
      currentUserDecision: "yes" | "no" | "unset";
      currentUserEligible: boolean;
    };
  }>;
  chat: Array<{ id: string; user: string; text: string }>;
};

export default function Groups() {
  const currentUserId = getCurrentUserId();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [groups, setGroups] = useState<GroupCard[]>([]);
  const [detail, setDetail] = useState<GroupDetail | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeRecommendationId, setActiveRecommendationId] = useState<string | null>(null);
  const [autoJoinPaymentReminder, setAutoJoinPaymentReminder] = useState<{
    roomId: string;
    roomName: string;
    dueHours: number;
  } | null>(null);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(false);

  const loadGroups = async () => {
    try {
      setLoadingGroups(true);
      const payload = await apiGet<{ groups: GroupCard[] }>(`/api/v1/groups?user_id=${currentUserId}`);
      setGroups(payload.groups ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  const loadDetail = async (groupId: string) => {
    try {
      setLoadingDetail(true);
      const payload = await apiGet<GroupDetail>(`/api/v1/groups/${groupId}?user_id=${currentUserId}`);
      setDetail(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load group details");
    } finally {
      setLoadingDetail(false);
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
    setUpcomingExpanded(false);
    setRecommendationsExpanded(false);
    void loadDetail(selectedGroupId);
  }, [selectedGroupId]);

  const groupCards = useMemo(
    () =>
      groups.map((group) => ({
        group,
        skill: { profile: group.skillProfile ?? "Mixed" },
      })),
    [groups]
  );

  const sendChat = async () => {
    if (!selectedGroupId || !chatMessage.trim()) return;
    await apiPost(`/api/v1/groups/${selectedGroupId}/chat`, { user_id: currentUserId, text: chatMessage });
    setChatMessage("");
    await loadDetail(selectedGroupId);
  };

  const setRecommendationInterest = async (roomId: string, wantsToJoin: boolean) => {
    if (!selectedGroupId) return;
    try {
      const payload = await apiPost<{
        autoJoined?: boolean;
        interestedCount?: number;
        neededCount?: number;
        paymentReminder?: boolean;
        paymentDueHours?: number | null;
      }>(
        `/api/v1/groups/${selectedGroupId}/recommendations/${roomId}/interest`,
        { user_id: currentUserId, wants_to_join: wantsToJoin }
      );
      if (payload.autoJoined) {
        toast.success("All available members confirmed. Group auto-joined this room.");
        if (payload.paymentReminder) {
          const targetRoom = detail?.recommendations.find((r) => r.room.id === roomId)?.room;
          setAutoJoinPaymentReminder({
            roomId,
            roomName: targetRoom?.location ?? "this room",
            dueHours: payload.paymentDueHours ?? 24,
          });
        }
      } else {
        toast.success(wantsToJoin ? "Marked as available for this room." : "Marked as unavailable for this room.");
      }
      await loadDetail(selectedGroupId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update recommendation interest");
    }
  };

  if (selectedGroupId) {
    if (!detail || loadingDetail) {
      return (
        <div className="app-shell">
          <FootballLoader fullScreen label="Loading group details..." />
          <Navigation />
        </div>
      );
    }

    const selectedGroup = detail.group;
    const recommendations = detail.recommendations;
    const upcomingGroupGames = detail.upcomingGroupGames ?? [];
    const members = detail.members;
    const summary = detail.summary;
    const activeRecommendation = recommendations.find((r) => r.room.id === activeRecommendationId) ?? null;

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

        <main className="space-y-4 p-4">
          <section className="surface-card pitch-lines overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#93a198]">Squad Snapshot</p>
                <h2 className="mt-1 text-lg font-semibold text-[#f2f7f2]">{selectedGroup.name}</h2>
              </div>
              <span className="chip border-[#35502f] bg-[#1d2f1d] text-[#bff48d]">{members.length} Members</span>
            </div>
            <div className="mt-4 flex -space-x-2">
              {members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#101510] bg-[#202720] text-xs font-semibold text-[#e7eee8]"
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-center">
                  <p className="text-xs text-[#95a39a]">Beginner</p>
                  <p className="mt-1 text-sm font-semibold text-[#e9f1ea]">{summary.skillBandSpread.Beginner}</p>
                </div>
                <div className="rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-center">
                  <p className="text-xs text-[#95a39a]">Intermediate</p>
                  <p className="mt-1 text-sm font-semibold text-[#e9f1ea]">{summary.skillBandSpread.Intermediate}</p>
                </div>
                <div className="rounded-lg border border-[#2b342b] bg-[#151d17] px-2 py-2 text-center">
                  <p className="text-xs text-[#95a39a]">Advanced</p>
                  <p className="mt-1 text-sm font-semibold text-[#e9f1ea]">{summary.skillBandSpread.Advanced}</p>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-[#2b342b] bg-[#151d17] px-3 py-2.5 text-sm">
              <span className="text-[#95a39a]">Group Reliability</span>
              <span className="font-semibold text-[#bff48d]">{summary.avgReliability}%</span>
            </div>
          </section>

          <section className="surface-card">
            <button
              onClick={() => setUpcomingExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h3 className="text-base font-semibold text-[#f2f7f2]">Upcoming Group Games</h3>
                <p className="mt-1 text-sm text-[#9fac9f]">Unique rooms with participants joined via this group.</p>
              </div>
              {upcomingExpanded ? <ChevronUp className="h-4 w-4 text-[#9fb0a4]" /> : <ChevronDown className="h-4 w-4 text-[#9fb0a4]" />}
            </button>
            {upcomingExpanded ? <div className="mt-4 space-y-3">
              {upcomingGroupGames.length > 0 ? (
                upcomingGroupGames.map((item) => (
                  <div key={item.room.id} className="rounded-xl border border-[#304033] bg-[#141d16] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#edf3ee]">{item.room.location}</p>
                        <p className="mt-1 text-sm text-[#a4b2a9]">
                          {item.room.date} · {item.room.time}
                          {item.room.priceVisible === false ? "" : ` · $${item.room.price}`}
                        </p>
                        <p className="mt-1 text-sm text-[#b9c7bd]">
                          {item.room.playersJoined}/{item.room.maxPlayers} players
                        </p>
                        <p className="mt-1 text-sm text-[#9aa89f]">Joined via group: {item.joinedMemberNames.join(", ")}</p>
                      </div>
                      {item.room.allowedBand ? <SkillBadge level={item.room.allowedBand} colored /> : <SkillBadge level="Hybrid" colored />}
                    </div>
                    <Link href={`/game/${item.room.id}?source=group-upcoming`} className="btn-secondary mt-3 text-sm">
                      View Room
                    </Link>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-[#2b352d] bg-[#141a15] px-3 py-2.5 text-sm text-[#94a297]">
                  No upcoming rooms joined via this group yet.
                </div>
              )}
            </div> : null}
          </section>

          <section className="surface-card">
            <button
              onClick={() => setRecommendationsExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h3 className="text-base font-semibold text-[#f2f7f2]">Recommended Games</h3>
                <p className="mt-1 text-sm text-[#9fac9f]">Coordinated options ranked for your group.</p>
              </div>
              {recommendationsExpanded ? <ChevronUp className="h-4 w-4 text-[#9fb0a4]" /> : <ChevronDown className="h-4 w-4 text-[#9fb0a4]" />}
            </button>
            {recommendationsExpanded ? <div className="mt-4 space-y-4">
              {recommendations.length > 0 ? recommendations.map((item) => (
                <div key={item.room.id} className="group/reco rounded-2xl border border-[#2e3a31] bg-[#141b16] p-4 transition-all duration-200 hover:border-[#425646] hover:bg-[#172018]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8ca08f]">Room Recommendation</p>
                      <p className="mt-1 text-lg font-semibold text-[#edf3ee]">{item.room.location}</p>
                      <p className="mt-1 text-sm text-[#a4b2a9]">
                        {item.room.date} · {item.room.time}
                        {item.room.priceVisible === false ? "" : ` · $${item.room.price}`}
                      </p>
                      <p className="mt-1 text-sm text-[#b9c7bd]">
                        {item.room.playersJoined}/{item.room.maxPlayers} players · {item.roomType}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#3e5442] bg-[#1e2a20] px-2.5 py-1 text-sm font-medium text-[#c5f19b]">
                          Interest {item.interest.interestedCount}/{item.interest.neededCount}
                        </span>
                        <span className="rounded-full border border-[#3e4742] bg-[#242d26] px-2.5 py-1 text-sm font-medium text-[#d2ddd4]">
                          Waiting {item.interest.pendingNames.length}
                        </span>
                        <span className="rounded-full border border-[#5b3a3a] bg-[#311f1f] px-2.5 py-1 text-sm font-medium text-[#e5b5b5]">
                          Declined {item.interest.declinedCount}
                        </span>
                        {item.interest.isReady ? (
                          <span className="rounded-full border border-[#5e8b2c] bg-[#223517] px-2.5 py-1 text-sm font-semibold text-[#b8ff6f]">
                            Auto-Join Ready
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {item.room.allowedBand ? <SkillBadge level={item.room.allowedBand} colored /> : <SkillBadge level="Hybrid" colored />}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setActiveRecommendationId(item.room.id)} className="btn-primary flex-1 text-sm shadow-[0_8px_22px_rgba(157,255,63,0.18)]">
                      View Availability Match
                    </button>
                    <Link href={`/game/${item.room.id}?source=group`} className="btn-secondary text-sm">
                      View Room
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="rounded-xl border border-[#2b352d] bg-[#141a15] px-3 py-3 text-sm text-[#94a297]">
                  <p>{summary.recommendationNote || "No recommendations right now."}</p>
                  {typeof summary.membersWithAvailability === "number" ? (
                    <p className="mt-1 text-xs text-[#839287]">
                      Members with availability: {summary.membersWithAvailability}/{members.length}
                    </p>
                  ) : null}
                </div>
              )}
            </div> : null}
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

        <Dialog open={Boolean(activeRecommendation)} onOpenChange={(open) => setActiveRecommendationId(open ? activeRecommendationId : null)}>
          <DialogContent className="border-[#2d372f] bg-[#0f1511]">
            {activeRecommendation ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-[#eef5ef]">Availability Match</DialogTitle>
                  <DialogDescription className="text-[#9faea3]">
                    {activeRecommendation.room.location} · {activeRecommendation.room.date} · {activeRecommendation.room.time}
                    {activeRecommendation.room.priceVisible === false ? "" : ` · $${activeRecommendation.room.price}`}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-[#3a4a3f] bg-[#18211c] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-[#eef5ef]">Availability Match Score</span>
                      <span className="rounded-full bg-[#9dff3f]/15 px-2 py-0.5 font-semibold text-[#9dff3f]">
                        {activeRecommendation.availability.percent}%
                      </span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-[#28322b]">
                      <div
                        className="h-full rounded-full bg-[#9dff3f]"
                        style={{ width: `${activeRecommendation.availability.percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-[#b9c7bd]">
                      <span className="font-semibold text-[#9dff3f]">{activeRecommendation.availability.canCount}</span> can make it ·{" "}
                      <span className="font-semibold text-[#e3a5a5]">{activeRecommendation.availability.cannotCount}</span> can't
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="rounded-lg border border-[#33543a] bg-[#173220] px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#95d6a4]">Can Make It</p>
                        <p className="mt-1 text-sm text-[#d5e8d9]">{activeRecommendation.availability.canNames.join(", ") || "None"}</p>
                      </div>
                      <div className="rounded-lg border border-[#5c3737] bg-[#311d1d] px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#e1a9a9]">Unavailable</p>
                        <p className="mt-1 text-sm text-[#edd8d8]">{activeRecommendation.availability.cannotNames.join(", ") || "None"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#303a32] bg-[#161d18] p-4">
                    <p className="text-base text-[#b5c5b8]">
                      Interest: {activeRecommendation.interest.interestedCount}/{activeRecommendation.interest.neededCount} confirmed
                    </p>
                    {activeRecommendation.interest.pendingNames.length > 0 ? (
                      <p className="mt-1 text-sm text-[#93a59a]">Waiting: {activeRecommendation.interest.pendingNames.join(", ")}</p>
                    ) : null}
                    {activeRecommendation.interest.declinedNames.length > 0 ? (
                      <p className="mt-1 text-sm text-[#cc9f9f]">Not joining: {activeRecommendation.interest.declinedNames.join(", ")}</p>
                    ) : null}
                  </div>
                  {activeRecommendation.interest.currentUserEligible ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => void setRecommendationInterest(activeRecommendation.room.id, true)}
                        className={
                          activeRecommendation.interest.currentUserDecision === "yes"
                            ? "btn-primary w-full text-sm shadow-[0_10px_24px_rgba(157,255,63,0.2)]"
                            : "btn-secondary w-full text-sm"
                        }
                      >
                        I Can Make It
                      </button>
                      <button
                        onClick={() => void setRecommendationInterest(activeRecommendation.room.id, false)}
                        className={
                          activeRecommendation.interest.currentUserDecision === "no"
                            ? "inline-flex min-h-11 items-center justify-center rounded-lg border border-[#7c4b4b] bg-[#3a2323] px-4 py-2.5 text-sm font-medium text-[#f0d2d2]"
                            : "btn-secondary w-full text-sm"
                        }
                      >
                        Can't Make It
                      </button>
                    </div>
                  ) : (
                    <button className="btn-secondary w-full text-sm" disabled>
                      Not Eligible
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(autoJoinPaymentReminder)} onOpenChange={(open) => { if (!open) setAutoJoinPaymentReminder(null); }}>
          <DialogContent className="border-[#2d372f] bg-[#0f1511]">
            <DialogHeader>
              <DialogTitle className="text-[#eef5ef]">Payment Reminder</DialogTitle>
              <DialogDescription className="text-[#9faea3]">
                Auto-join succeeded for {autoJoinPaymentReminder?.roomName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-[#4b3c22] bg-[#2a2114] p-3 text-[#e8d7b6]">
                This auto-join crossed the 80% capacity threshold. Please complete payment within{" "}
                <span className="font-semibold">{autoJoinPaymentReminder?.dueHours ?? 24} hours</span>, or you may be removed from the group.
              </div>
              <Link
                href={autoJoinPaymentReminder ? `/game/${autoJoinPaymentReminder.roomId}?source=group-payment-reminder` : "#"}
                className="btn-primary w-full text-sm"
                onClick={() => setAutoJoinPaymentReminder(null)}
              >
                Open Room
              </Link>
            </div>
          </DialogContent>
        </Dialog>

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
        {loadingGroups ? <FootballLoader label="Loading your groups..." /> : null}
        {groupCards.map(({ group, skill }) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroupId(group.id)}
            className="surface-card w-full text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3b4c3e] hover:bg-[#131b15]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8ea090]">Group</p>
                <h2 className="mt-1 text-lg font-semibold text-[#f2f7f2]">{group.name}</h2>
                <p className="mt-1 text-sm text-[#98a69d]">{group.memberCount} members</p>
              </div>
              <span className="chip">{skill.profile}</span>
            </div>
          </button>
        ))}
      </main>

      <Navigation />
    </div>
  );
}
