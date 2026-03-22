import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Bell, CalendarDays, Flame, Medal, Plus, ShieldCheck, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import { currentUser, players } from "@/data/mockData";

const matchHistory = [
  { id: "m1", date: "Mar 20", venue: "Downtown Sports Arena", result: "W 8-6" },
  { id: "m2", date: "Mar 16", venue: "Metro Futsal Complex", result: "L 5-7" },
  { id: "m3", date: "Mar 12", venue: "Westgate Indoor Sports", result: "W 6-4" },
  { id: "m4", date: "Mar 09", venue: "Eastside Court", result: "W 9-8" },
];

const achievements = [
  "Reliable teammate",
  "5-week attendance streak",
  "Completed 40+ rated matches",
  "No no-shows in last 20 games",
];

const recentActivity = [
  "Rated 6 players after Downtown game",
  "Joined Friday Core recommendation",
  "Confirmed availability for 3 slots this week",
];

const weekdayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function Profile() {
  const [walletBalance, setWalletBalance] = useState(125.5);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [availabilityMode, setAvailabilityMode] = useState<"recurring" | "specific">("recurring");
  const [recurringSlots, setRecurringSlots] = useState<Record<string, boolean[]>>({
    Mon: Array(17).fill(false),
    Tue: Array(17).fill(false),
    Wed: Array(17).fill(false),
    Thu: Array(17).fill(false),
    Fri: Array(17).fill(false),
    Sat: Array(17).fill(false),
    Sun: Array(17).fill(false),
  });
  const [specificDate, setSpecificDate] = useState("");
  const [specificTime, setSpecificTime] = useState("19:00");
  const [specificDates, setSpecificDates] = useState<Array<{ date: string; time: string }>>([]);

  const regularSquad = players.filter((p) => ["u-2", "u-4", "u-6"].includes(p.id));

  const selectedRecurringCount = useMemo(() => {
    return Object.values(recurringSlots).reduce(
      (total, hours) => total + hours.filter(Boolean).length,
      0
    );
  }, [recurringSlots]);

  const handleTopUp = () => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid top-up amount");
      return;
    }
    setWalletBalance((prev) => prev + amount);
    setTopUpAmount("");
    toast.success(`Wallet topped up by $${amount.toFixed(2)}`);
  };

  const toggleSlot = (day: string, hourIndex: number) => {
    setRecurringSlots((prev) => {
      const next = { ...prev };
      next[day][hourIndex] = !next[day][hourIndex];
      return next;
    });
  };

  const addSpecificDate = () => {
    if (!specificDate) {
      toast.error("Select a date first");
      return;
    }
    setSpecificDates((prev) => [...prev, { date: specificDate, time: specificTime }]);
    setSpecificDate("");
    setSpecificTime("19:00");
    toast.success("Availability date added");
  };

  return (
    <div className="min-h-screen bg-[#0b0f18] pb-24">
      <header className="border-b border-white/10 px-4 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Profile</h1>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <button className="rounded-xl border border-[#31405c] bg-[#111a28] p-2 text-[#d6e0ef]">
                <Bell className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/profile/edit">
              <button className="rounded-xl border border-[#31405c] bg-[#111a28] px-3 py-2 text-xs font-semibold text-[#d6e0ef]">
                Edit
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4">
        <section className="surface-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1b2538] text-lg font-semibold text-white">AC</div>
            <div>
              <h2 className="text-lg font-semibold text-white">{currentUser.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <SkillBadge level={currentUser.publicSkillBand} colored />
                <span className="text-xs text-[#9fb1cd]">Public tier shown to others</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea1bf]">Matches played</p>
            <p className="mt-1 text-xl font-semibold text-white">{currentUser.gamesPlayed}</p>
          </div>
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea1bf]">Reliability</p>
            <p className="mt-1 text-xl font-semibold text-[#a8ff3f]">{currentUser.reliabilityScore}%</p>
          </div>
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea1bf]">Participation streak</p>
            <p className="mt-1 text-xl font-semibold text-white">{currentUser.streakWeeks} weeks</p>
          </div>
          <div className="rounded-2xl bg-[#0f1622] p-3">
            <p className="text-[11px] text-[#8ea1bf]">Last 20 form</p>
            <p className="mt-1 text-xl font-semibold text-white">14W / 6L</p>
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Wallet className="h-4 w-4 text-[#a8ff3f]" /> Wallet
          </h3>
          <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#101624] p-3">
            <p className="text-xs text-[#93a6c2]">Current balance</p>
            <p className="text-lg font-semibold text-white">${walletBalance.toFixed(2)}</p>
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Top-up amount"
              className="border-[#2f3a51] bg-[#0f1624] text-white"
            />
            <button
              onClick={handleTopUp}
              className="rounded-xl bg-[#a8ff3f] px-3 py-2 text-xs font-semibold text-[#11190f]"
            >
              Top up
            </button>
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarDays className="h-4 w-4 text-[#8db4ff]" /> Availability
          </h3>
          <p className="mt-1 text-xs text-[#95a8c4]">Used by your groups and recommendations to find the best released games.</p>

          <div className="mt-3 flex rounded-2xl bg-[#101624] p-1">
            <button
              onClick={() => setAvailabilityMode("recurring")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold ${
                availabilityMode === "recurring" ? "bg-[#1a2538] text-white" : "text-[#9cb0cd]"
              }`}
            >
              Recurring
            </button>
            <button
              onClick={() => setAvailabilityMode("specific")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold ${
                availabilityMode === "specific" ? "bg-[#1a2538] text-white" : "text-[#9cb0cd]"
              }`}
            >
              Specific dates
            </button>
          </div>

          {availabilityMode === "recurring" ? (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-[#93a6c2]">Tap your usual slots (7:00 to 23:00). Selected: {selectedRecurringCount}</p>
              <div className="space-y-2">
                {weekdayKeys.map((day) => (
                  <div key={day}>
                    <p className="mb-1 text-xs text-[#a9bbd5]">{day}</p>
                    <div className="grid grid-cols-6 gap-1">
                      {recurringSlots[day].map((isOn, idx) => (
                        <button
                          key={`${day}-${idx}`}
                          onClick={() => toggleSlot(day, idx)}
                          className={`rounded-md py-1 text-[10px] font-medium ${
                            isOn ? "bg-[#a8ff3f] text-[#10170e]" : "bg-[#0f1624] text-[#8ea2bf]"
                          }`}
                        >
                          {idx + 7}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  className="border-[#2f3a51] bg-[#0f1624] text-white"
                />
                <Input
                  type="time"
                  value={specificTime}
                  onChange={(e) => setSpecificTime(e.target.value)}
                  className="border-[#2f3a51] bg-[#0f1624] text-white"
                />
              </div>
              <button
                onClick={addSpecificDate}
                className="inline-flex items-center gap-1 rounded-xl bg-[#1a2538] px-3 py-2 text-xs font-semibold text-[#dce5f3]"
              >
                <Plus className="h-3.5 w-3.5" /> Add date
              </button>

              <div className="space-y-2">
                {specificDates.map((item, index) => (
                  <div key={`${item.date}-${item.time}-${index}`} className="rounded-xl bg-[#101624] p-2 text-xs text-[#cfdbec]">
                    {item.date} · {item.time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarDays className="h-4 w-4 text-[#8db4ff]" /> Match history
          </h3>
          <div className="mt-3 space-y-2">
            {matchHistory.map((m) => (
              <div key={m.id} className="rounded-2xl bg-[#101624] p-3">
                <p className="text-sm font-medium text-white">{m.venue}</p>
                <p className="mt-1 text-xs text-[#9eb1cd]">{m.date} · {m.result}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Medal className="h-4 w-4 text-[#ffd67c]" /> Achievements
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {achievements.map((achievement) => (
              <span key={achievement} className="rounded-full border border-[#384863] bg-[#101726] px-3 py-1 text-xs text-[#d2dded]">
                {achievement}
              </span>
            ))}
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Users className="h-4 w-4 text-[#8fd9ff]" /> Regular squad
          </h3>
          <p className="mt-1 text-xs text-[#95a8c4]">Most played with in recent sessions.</p>
          <div className="mt-3 space-y-2">
            {regularSquad.map((mate) => (
              <div key={mate.id} className="flex items-center justify-between rounded-2xl bg-[#101624] p-2.5">
                <p className="text-sm text-white">{mate.name}</p>
                <SkillBadge level={mate.publicSkillBand} colored />
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Flame className="h-4 w-4 text-[#a8ff3f]" /> Recent activity
          </h3>
          <div className="mt-3 space-y-2">
            {recentActivity.map((item) => (
              <p key={item} className="rounded-2xl bg-[#101624] p-2.5 text-xs text-[#d0dced]">{item}</p>
            ))}
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-[#a8ff3f]" /> Integrity and reliability
          </h3>
          <p className="mt-2 text-xs text-[#9cb0cb]">
            Ratings weight recent matches more heavily (last 20 sessions), while public profile only shows broad skill tier.
          </p>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
