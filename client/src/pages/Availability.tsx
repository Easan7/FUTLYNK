import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarDays, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import { Input } from "@/components/ui/input";
import PitchOverlay from "@/components/PitchOverlay";
import { apiDelete, apiGet, apiPost, getCurrentUserId } from "@/lib/api";

const weekdayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type RecurringRule = {
  id: string;
  days: string[];
  from: string;
  to: string;
};

export default function Availability() {
  const currentUserId = getCurrentUserId();
  const [availabilityMode, setAvailabilityMode] = useState<"recurring" | "specific">("recurring");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Tue", "Thu"]);
  const [rangeFrom, setRangeFrom] = useState("19:00");
  const [rangeTo, setRangeTo] = useState("21:00");
  const [recurringRules, setRecurringRules] = useState<RecurringRule[]>([]);

  const [specificDate, setSpecificDate] = useState("");
  const [specificFrom, setSpecificFrom] = useState("19:00");
  const [specificTo, setSpecificTo] = useState("21:00");
  const [specificDates, setSpecificDates] = useState<Array<{ id: string; date: string; from: string; to: string }>>([]);
  const [inlineError, setInlineError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const payload = await apiGet<{ recurringRules: RecurringRule[]; specificDates: Array<{ id: string; date: string; from: string; to: string }> }>(
        `/api/v1/availability?user_id=${currentUserId}`
      );
      setRecurringRules(payload.recurringRules ?? []);
      setSpecificDates(payload.specificDates ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading && recurringRules.length === 0 && specificDates.length === 0) {
    return (
      <div className="app-shell">
        <FootballLoader fullScreen label="Loading availability..." />
        <Navigation />
      </div>
    );
  }

  const addRecurringRule = async () => {
    setInlineError("");
    if (selectedDays.length === 0) {
      setInlineError("Select at least one day.");
      return;
    }
    if (rangeFrom >= rangeTo) {
      setInlineError("End time must be after start time.");
      return;
    }

    await apiPost("/api/v1/availability/recurring", {
      user_id: currentUserId,
      days: selectedDays,
      from_time: rangeFrom,
      to_time: rangeTo,
    });

    toast.success("Recurring window added");
    await load();
  };

  const addSpecificDate = async () => {
    setInlineError("");
    if (!specificDate) {
      setInlineError("Select a date first.");
      return;
    }
    if (specificFrom >= specificTo) {
      setInlineError("End time must be after start time.");
      return;
    }

    await apiPost("/api/v1/availability/specific", {
      user_id: currentUserId,
      date_value: specificDate,
      from_time: specificFrom,
      to_time: specificTo,
    });

    setSpecificDate("");
    setSpecificFrom("19:00");
    setSpecificTo("21:00");
    toast.success("Specific date added");
    await load();
  };

  const removeRule = async (id: string) => {
    await apiDelete(`/api/v1/availability/${id}?user_id=${currentUserId}`);
    await load();
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

              <button onClick={() => void addRecurringRule()} className="btn-secondary text-xs">
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
                      onClick={() => void removeRule(rule.id)}
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Input type="date" value={specificDate} onChange={(e) => setSpecificDate(e.target.value)} />
                <Input type="time" value={specificFrom} onChange={(e) => setSpecificFrom(e.target.value)} />
                <Input type="time" value={specificTo} onChange={(e) => setSpecificTo(e.target.value)} />
              </div>
              <button onClick={() => void addSpecificDate()} className="btn-secondary text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Date
              </button>
              {specificDates.map((item) => (
                <div
                  key={item.id}
                  className="surface-inner flex items-center justify-between gap-2 text-xs text-[#d6dfd8]"
                >
                  <span>
                    {item.date} · {item.from} - {item.to}
                  </span>
                  <button
                    className="btn-secondary !min-h-8 !px-2"
                    onClick={() => void removeRule(item.id)}
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
