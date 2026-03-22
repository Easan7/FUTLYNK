import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarClock, MessageSquare, Plus, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getGroupOverlapSlots, getGroupRecommendedRooms, getGroupSkillSummary, groups, players } from "@/data/mockData";
import AppHero from "@/components/AppHero";

export default function Groups() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chat, setChat] = useState([
    { id: "1", user: "Marcus", text: "Can we run another one this week?", time: "2h ago" },
    { id: "2", user: "Sarah", text: "I can do Wed or Sun morning.", time: "1h ago" },
  ]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  const groupCards = useMemo(() => {
    return groups.map((group) => {
      const skill = getGroupSkillSummary(group);
      const overlap = getGroupOverlapSlots(group)[0];
      const recommended = getGroupRecommendedRooms(group)[0];

      return {
        group,
        skill,
        overlap,
        recommended,
      };
    });
  }, []);

  const sendChat = () => {
    if (!chatMessage.trim()) return;
    setChat((prev) => [{ id: String(prev.length + 1), user: "You", text: chatMessage, time: "now" }, ...prev]);
    setChatMessage("");
  };

  if (selectedGroup) {
    const summary = getGroupSkillSummary(selectedGroup);
    const overlapSlots = getGroupOverlapSlots(selectedGroup);
    const recommendations = getGroupRecommendedRooms(selectedGroup);
    const memberObjects = selectedGroup.memberIds
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean);

    return (
      <div className="min-h-screen bg-[#0b0f18] pb-24">
        <header className="border-b border-white/10 px-4 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedGroupId(null)}
              className="rounded-xl border border-[#2a3448] bg-[#101624] p-2 text-[#c4d0e2]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">{selectedGroup.name}</h1>
              <p className="text-xs text-[#9aaac4]">{selectedGroup.memberIds.length} members · {summary.profile}</p>
            </div>
          </div>
        </header>

        <main className="space-y-4 p-4">
          <section className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8ea0bc]">Group overview</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Coordination-ready squad</h2>
            <p className="mt-1 text-sm text-[#9db0cc]">
              {summary.profile === "Mixed"
                ? "Mixed skill composition. We recommend hybrid and balanced rooms first."
                : "Same-level squad. We prioritize rooms close to your band."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#33405b] bg-[#111929] px-3 py-1 text-xs text-[#c4d0e3]">
                Beginner {summary.counts.Beginner}
              </span>
              <span className="rounded-full border border-[#33405b] bg-[#111929] px-3 py-1 text-xs text-[#c4d0e3]">
                Intermediate {summary.counts.Intermediate}
              </span>
              <span className="rounded-full border border-[#33405b] bg-[#111929] px-3 py-1 text-xs text-[#c4d0e3]">
                Advanced {summary.counts.Advanced}
              </span>
            </div>
          </section>

          <section className="surface-card p-4">
            <h3 className="text-sm font-semibold text-white">Availability overlap</h3>
            <p className="mt-1 text-xs text-[#92a4c1]">Best windows where most members can play.</p>
            <div className="mt-3 space-y-2">
              {overlapSlots.map((slot) => (
                <div key={slot.slot} className="rounded-2xl bg-[#101624] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">{slot.slot}</p>
                    <span className="text-xs text-[#a8ff3f]">{slot.count}/{selectedGroup.memberIds.length} available</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#1f2a3e]">
                    <div
                      className="h-full rounded-full bg-[#a8ff3f]"
                      style={{ width: `${(slot.count / selectedGroup.memberIds.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-4">
            <h3 className="text-sm font-semibold text-white">Recommended games for this group</h3>
            <p className="mt-1 text-xs text-[#92a4c1]">Existing released games ranked for your group fit.</p>
            <div className="mt-3 space-y-3">
              {recommendations.map((item) => (
                <div key={item.room.id} className="rounded-2xl bg-[#101624] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[#a8ff3f]">{item.fitLabel}</p>
                      <h4 className="text-sm font-semibold text-white">{item.room.title}</h4>
                      <p className="text-xs text-[#9aadca]">{item.room.location} · {item.room.date} · {item.room.time}</p>
                    </div>
                    {item.room.allowedBand === null ? (
                      <SkillBadge level="Hybrid" colored />
                    ) : (
                      <SkillBadge level={item.room.allowedBand} colored />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-[#c2cee2]">
                    {item.availableMemberCount} members can make this slot · ${item.room.price}/player
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={() => toast.success("Updated recommendations for your group")}
              className="rounded-2xl bg-[#a8ff3f] px-4 py-3 text-sm font-semibold text-[#121a0f]"
            >
              Find best game for group
            </button>
            <button
              onClick={() => toast.success("Interest captured. We'll prioritise a suitable game if feasible.")}
              className="rounded-2xl border border-[#33425d] bg-[#121a29] px-4 py-3 text-sm font-semibold text-[#d3dded]"
            >
              Request preferred slot
            </button>
            <p className="sm:col-span-2 text-xs text-[#8698b5]">
              Requests are demand signals. They help us prioritise released games, but they are not guaranteed bookings.
            </p>
          </section>

          <section className="surface-card p-4">
            <h3 className="text-sm font-semibold text-white">Play again together</h3>
            <p className="mt-1 text-xs text-[#93a6c2]">Recent squad can be invited in one tap for the next suitable room.</p>
            <div className="mt-3 flex -space-x-2">
              {memberObjects.slice(0, 4).map((member) => (
                <Avatar key={member!.id} className="h-9 w-9 border-2 border-[#111827]">
                  <AvatarFallback className="bg-[#1a2536] text-xs text-white">
                    {member!.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </section>

          <section className="surface-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Group chat</h3>
              <MessageSquare className="h-4 w-4 text-[#8ea2bf]" />
            </div>
            <div className="space-y-2">
              {chat.slice(0, 3).map((msg) => (
                <div key={msg.id} className="rounded-xl bg-[#101726] p-2.5">
                  <p className="text-xs text-[#c4d1e4]"><span className="font-semibold text-white">{msg.user}:</span> {msg.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Send quick message"
                className="border-[#2d3850] bg-[#0f1624] text-white"
              />
              <button
                onClick={sendChat}
                className="rounded-xl bg-[#1f2a3d] px-3 text-sm font-semibold text-[#d8e2f1]"
              >
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
    <div className="min-h-screen bg-[#0b0f18] pb-24">
      <header className="border-b border-white/10 px-4 pb-4 pt-6">
        <AppHero
          className="h-[184px]"
          title="Groups"
          subtitle="Coordination engine for overlap, fit, and squad continuity."
          badge="Squad overlap mode"
          action={
            <Link href="/create">
              <button className="rounded-2xl bg-[#8dff4d] px-3 py-2 text-xs font-semibold text-[#10170e]">
                <Plus className="mr-1 inline h-4 w-4" />
                Create
              </button>
            </Link>
          }
        />
      </header>

      <main className="space-y-3 p-4">
        {groupCards.map(({ group, skill, overlap, recommended }) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroupId(group.id)}
            className="w-full surface-card p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">{group.name}</h2>
                <p className="mt-1 text-xs text-[#9eb0cb]">{group.memberIds.length} members · {skill.profile}</p>
              </div>
              <span className="rounded-full bg-[#192334] px-2 py-1 text-[11px] text-[#cbd7ea]">{recommended ? "Game ready" : "No match yet"}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-2xl bg-[#101624] p-2.5 text-[#c4d1e5]">
                <p className="text-[#8da0be]">Next overlap</p>
                <p className="mt-1 font-medium text-white">{overlap?.slot ?? "Pending"}</p>
              </div>
              <div className="rounded-2xl bg-[#101624] p-2.5 text-[#c4d1e5]">
                <p className="text-[#8da0be]">Recommended</p>
                <p className="mt-1 font-medium text-white">{recommended?.room.location ?? "No slot yet"}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#9ab0ce]">
              <Users className="h-3.5 w-3.5" />
              <span>
                B {skill.counts.Beginner} · I {skill.counts.Intermediate} · A {skill.counts.Advanced}
              </span>
              <CalendarClock className="ml-2 h-3.5 w-3.5" />
              <span>{overlap?.count ?? 0} available</span>
              <Zap className="ml-2 h-3.5 w-3.5" />
              <span>{recommended?.fitLabel ?? "Needs signal"}</span>
            </div>
          </button>
        ))}
      </main>

      <Navigation />
    </div>
  );
}
