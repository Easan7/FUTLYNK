import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarDays, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import PitchOverlay from "@/components/PitchOverlay";

const AVAILABILITY_STORAGE_KEY = "futlynk_availability";
const weekdayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type RecurringRule = {
  id: string;
  days: string[];
  from: string;
  to: string;
};

type StoredAvailability = {
  recurringRules: RecurringRule[];
  specificDates: Array<{ date: string; time: string }>;
};

export default function Availability() {
  const savedAvailability =
    typeof window !== "undefined" ? window.localStorage.getItem(AVAILABILITY_STORAGE_KEY) : null;

  let parsedAvailability: StoredAvailability | null = null;
  if (savedAvailability) {
    try {
      parsedAvailability = JSON.parse(savedAvailability);
    } catch {
      parsedAvailability = null;
    }
  }

  const [availabilityMode, setAvailabilityMode] = useState<"recurring" | "specific">("recurring");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Tue", "Thu"]);
  const [rangeFrom, setRangeFrom] = useState("19:00");
  const [rangeTo, setRangeTo] = useState("21:00");
  const [recurringRules, setRecurringRules] = useState<RecurringRule[]>(
    parsedAvailability?.recurringRules ?? [{ id: "r1", days: ["Tue", "Thu"], from: "19:00", to: "21:00" }]
  );

  const [specificDate, setSpecificDate] = useState("");
  const [specificTime, setSpecificTime] = useState("19:00");
  const [specificDates, setSpecificDates] = useState<Array<{ date: string; time: string }>>(
    parsedAvailability?.specificDates ?? []
  );
  const [inlineError, setInlineError] = useState("");

  const persistAvailability = (nextRules: RecurringRule[], nextDates: Array<{ date: string; time: string }>) => {
    window.localStorage.setItem(
      AVAILABILITY_STORAGE_KEY,
      JSON.stringify({ recurringRules: nextRules, specificDates: nextDates })
    );
  };

  const addRecurringRule = () => {
    setInlineError("");
    if (selectedDays.length === 0) {
      setInlineError("Select at least one day.");
      return;
    }
    if (rangeFrom >= rangeTo) {
      setInlineError("End time must be after start time.");
      return;
    }
    if (recurringRules.some((rule) => rule.from === rangeFrom && rule.to === rangeTo && rule.days.join(",") === selectedDays.join(","))) {
      setInlineError("This recurring window already exists.");
      return;
    }

    const nextRules = [
      ...recurringRules,
      { id: `${Date.now()}`, days: [...selectedDays], from: rangeFrom, to: rangeTo },
    ];
    setRecurringRules(nextRules);
    persistAvailability(nextRules, specificDates);
    toast.success("Recurring window added");
  };

  const addSpecificDate = () => {
    setInlineError("");
    if (!specificDate) {
      setInlineError("Select a date first.");
      return;
    }
    if (specificDates.some((item) => item.date === specificDate && item.time === specificTime)) {
      setInlineError("This specific date/time already exists.");
      return;
    }
    const nextDates = [...specificDates, { date: specificDate, time: specificTime }];
    setSpecificDates(nextDates);
    setSpecificDate("");
    setSpecificTime("19:00");
    persistAvailability(recurringRules, nextDates);
    toast.success("Specific date added");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center gap-3">
          <Link href="/profile" className="btn-secondary relative z-10 !min-h-10 !px-3" aria-label="Back to profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="relative z-10">
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Availability</h1>
            <p className="text-xs text-[#95a39a]">Set recurring windows or specific dates</p>
          </div>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <CalendarDays className="h-4 w-4 text-[#9dff3f]" /> Availability Settings
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
                    <div>
                      <span className="text-[#d6dfd8]">{rule.days.join(", ")}</span>
                      <span className="ml-2 text-[#9dff3f]">
                        {rule.from} - {rule.to}
                      </span>
                    </div>
                    <button
                      className="btn-secondary !min-h-8 !px-2"
                      onClick={() => {
                        const nextRules = recurringRules.filter((item) => item.id !== rule.id);
                        setRecurringRules(nextRules);
                        persistAvailability(nextRules, specificDates);
                      }}
                      aria-label="Remove recurring window"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
                <div
                  key={`${item.date}-${item.time}-${index}`}
                  className="surface-inner flex items-center justify-between gap-2 text-xs text-[#d6dfd8]"
                >
                  <span>
                    {item.date} · {item.time}
                  </span>
                  <button
                    className="btn-secondary !min-h-8 !px-2"
                    onClick={() => {
                      const nextDates = specificDates.filter((_, dateIndex) => dateIndex !== index);
                      setSpecificDates(nextDates);
                      persistAvailability(recurringRules, nextDates);
                    }}
                    aria-label="Remove specific date"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {inlineError ? <p className="mt-3 text-xs text-[#d8a9a9]">{inlineError}</p> : null}
        </section>
      </main>

      <Navigation />
    </div>
  );
}
