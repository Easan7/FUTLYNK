import { useState } from "react";
import { apiPost, getCurrentUserId } from "@/lib/api";

type SkillBand = "Beginner" | "Intermediate" | "Advanced";

type SkillBandIntroProps = {
  onFinish: () => void;
};

const options: Array<{ value: SkillBand; title: string; hint: string }> = [
  { value: "Beginner", title: "Beginner", hint: "Learning core movement, passing, and positioning." },
  { value: "Intermediate", title: "Intermediate", hint: "Comfortable with tempo, space, and game decisions." },
  { value: "Advanced", title: "Advanced", hint: "Consistent execution under pressure and high game IQ." },
];

export default function SkillBandIntro({ onFinish }: SkillBandIntroProps) {
  const [selected, setSelected] = useState<SkillBand | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!selected || isSaving) return;
    setError("");
    setIsSaving(true);
    try {
      await apiPost("/api/v1/auth/skill-band", {
        user_id: getCurrentUserId(),
        public_skill_band: selected,
      });
      onFinish();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your skill band");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[81] overflow-hidden bg-[#1b2d1f]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "linear-gradient(to right, rgba(190,255,120,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(190,255,120,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-8 pt-[max(1.2rem,env(safe-area-inset-top))]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d6ebd1]" style={{ fontFamily: '"Rajdhani","Barlow",sans-serif' }}>
          FUTLYNK
        </p>
        <div className="mt-8">
          <h1 className="text-[clamp(2rem,6.4vw,2.75rem)] font-semibold leading-[1.03] text-[#f8fff5]" style={{ fontFamily: '"Rajdhani","Barlow",sans-serif' }}>
            Estimate your level.
          </h1>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-[#d5e5d2]">
            Pick your current football skill band so FUTLYNK can tune matching and recommendations.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {options.map((option) => {
            const active = selected === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelected(option.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  active ? "border-[#beff78] bg-[#223517]" : "border-[#4f7149] bg-[#102112]"
                }`}
              >
                <p className="text-base font-semibold text-[#f8fff5]">{option.title}</p>
                <p className="mt-1 text-sm text-[#c6d8c5]">{option.hint}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-auto">
          {error ? <p className="mb-3 text-sm text-[#ffd1d1]">{error}</p> : null}
          <button onClick={submit} disabled={!selected || isSaving} className="btn-primary w-full text-base shadow-[0_14px_30px_rgba(157,255,63,0.24)] disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
