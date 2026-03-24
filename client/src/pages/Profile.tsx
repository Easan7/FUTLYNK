import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Bell, CalendarDays, Clock3, Edit3, Medal, Plus, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/data/mockData";

const PROFILE_STORAGE_KEY = "futlynk_profile";

const availableAchievements = [
  { id: "1", name: "10 Games" },
  { id: "2", name: "Perfect Attendance" },
  { id: "3", name: "50 Games" },
  { id: "4", name: "Team Captain" },
];

const matchHistory = [
  { id: "m1", date: "Mar 20", venue: "Downtown Sports Arena", result: "W 8-6" },
  { id: "m2", date: "Mar 16", venue: "Metro Futsal Complex", result: "L 5-7" },
  { id: "m3", date: "Mar 12", venue: "Westgate Indoor Sports", result: "W 6-4" },
];

const weekdayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type RecurringRule = {
  id: string;
  days: string[];
  from: string;
  to: string;
};

export default function Profile() {
  let parsedProfile: {
    displayName?: string;
    username?: string;
    selectedTags?: string[];
    selectedAchievements?: string[];
  } | null = null;

  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      try {
        parsedProfile = JSON.parse(raw);
      } catch {
        parsedProfile = null;
      }
    }
  }

  const [availabilityMode, setAvailabilityMode] = useState<"recurring" | "specific">("recurring");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Tue", "Thu"]);
  const [rangeFrom, setRangeFrom] = useState("19:00");
  const [rangeTo, setRangeTo] = useState("21:00");
  const [recurringRules, setRecurringRules] = useState<RecurringRule[]>([
    { id: "r1", days: ["Tue", "Thu"], from: "19:00", to: "21:00" },
  ]);

  const [specificDate, setSpecificDate] = useState("");
  const [specificTime, setSpecificTime] = useState("19:00");
  const [specificDates, setSpecificDates] = useState<Array<{ date: string; time: string }>>([]);

  const selectedAchievementNames = useMemo(() => {
    const selected = parsedProfile?.selectedAchievements ?? ["1", "2"];
    return selected
      .map((id) => availableAchievements.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];
  }, [parsedProfile]);

  const displayName = parsedProfile?.displayName ?? currentUser.name;
  const selectedTags = parsedProfile?.selectedTags ?? ["Reliable", "Team Player", "Forward", "Punctual"];

  const addRecurringRule = () => {
    if (selectedDays.length === 0) {
      toast.error("Select at least one day");
      return;
    }
    if (rangeFrom >= rangeTo) {
      toast.error("End time must be after start time");
      return;
    }

    setRecurringRules((prev) => [
      ...prev,
      { id: `${Date.now()}`, days: [...selectedDays], from: rangeFrom, to: rangeTo },
    ]);
    toast.success("Recurring window added");
  };

  const addSpecificDate = () => {
    if (!specificDate) {
      toast.error("Select a date first");
      return;
    }
    setSpecificDates((prev) => [...prev, { date: specificDate, time: specificTime }]);
    setSpecificDate("");
    setSpecificTime("19:00");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#f2f7f2]">Profile</h1>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <button className="btn-secondary !px-3">
                <Bell className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/profile/edit">
              <button className="btn-secondary !px-3">
                <Edit3 className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link href="/friends">
            <button className="btn-secondary w-full">
              <Users className="h-4 w-4" /> Friends
            </button>
          </Link>
          <Link href="/wallet">
            <button className="btn-primary w-full">
              <Wallet className="h-4 w-4" /> Wallet
            </button>
          </Link>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card pitch-lines">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#202820] text-lg font-semibold text-[#f2f7f2]">
              {displayName
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#f2f7f2]">{displayName}</h2>
              <div className="mt-1 flex items-center gap-2">
                <SkillBadge level={currentUser.publicSkillBand} colored />
                <span className="text-xs text-[#93a198]">{currentUser.gamesPlayed} matches</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="score-pill">
              <p className="text-[11px] text-[#8f9d93]">Reliability</p>
              <p className="mt-1 text-lg font-semibold text-[#a3ff49]">{currentUser.reliabilityScore}%</p>
            </div>
            <div className="score-pill">
              <p className="text-[11px] text-[#8f9d93]">Streak</p>
              <p className="mt-1 text-lg font-semibold text-[#f1f7f2]">{currentUser.streakWeeks}w</p>
            </div>
          </div>
        </section>

        <section className="surface-card">
          <h3 className="text-sm font-semibold text-[#f2f7f2]">Player Tags</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span key={tag} className="chip chip-active">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <Medal className="h-4 w-4 text-[#9dff3f]" /> Achievements
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {selectedAchievementNames.map((achievement) => (
              <div key={achievement} className="surface-inner">
                <p className="text-sm font-semibold text-[#eef4ef]">{achievement}</p>
                <p className="mt-1 text-xs text-[#95a39a]">Unlocked profile highlight</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <CalendarDays className="h-4 w-4 text-[#9dff3f]" /> Availability
          </h3>

          <div className="mt-3 flex rounded-xl bg-[#141b15] p-1">
            <button
              onClick={() => setAvailabilityMode("recurring")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs ${
                availabilityMode === "recurring" ? "bg-[#202920] text-[#ecf2ed]" : "text-[#8f9d93]"
              }`}
            >
              Recurring
            </button>
            <button
              onClick={() => setAvailabilityMode("specific")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs ${
                availabilityMode === "specific" ? "bg-[#202920] text-[#ecf2ed]" : "text-[#8f9d93]"
              }`}
            >
              Specific Dates
            </button>
          </div>

          {availabilityMode === "recurring" ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs text-[#95a39a]">Select days</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {weekdayKeys.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() =>
                          setSelectedDays((prev) =>
                            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                          )
                        }
                        className={`chip ${active ? "chip-active" : ""}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="mb-1 text-xs text-[#95a39a]">From</p>
                  <Input type="time" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-[#95a39a]">To</p>
                  <Input type="time" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
                </div>
              </div>

              <button onClick={addRecurringRule} className="btn-secondary text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Recurring Window
              </button>

              <div className="space-y-2">
                {recurringRules.map((rule) => (
                  <div key={rule.id} className="surface-inner flex items-center justify-between text-xs">
                    <span className="text-[#d6dfd8]">{rule.days.join(", ")}</span>
                    <span className="text-[#9dff3f]">
                      {rule.from} - {rule.to}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" value={specificDate} onChange={(e) => setSpecificDate(e.target.value)} />
                <Input type="time" value={specificTime} onChange={(e) => setSpecificTime(e.target.value)} />
              </div>
              <button onClick={addSpecificDate} className="btn-secondary text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Date
              </button>
              {specificDates.map((item, index) => (
                <div key={`${item.date}-${item.time}-${index}`} className="surface-inner text-xs text-[#d6dfd8]">
                  {item.date} · {item.time}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <Clock3 className="h-4 w-4 text-[#9dff3f]" /> Match History
          </h3>
          <div className="mt-3 space-y-2">
            {matchHistory.map((m) => (
              <div key={m.id} className="surface-inner">
                <p className="text-sm text-[#edf3ee]">{m.venue}</p>
                <p className="mt-1 text-xs text-[#95a39a]">
                  {m.date} · {m.result}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
