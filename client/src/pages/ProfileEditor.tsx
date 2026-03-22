import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const availableTags = [
  "Reliable",
  "Team Player",
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
  "Punctual",
  "Technical",
  "Fast",
];

const availableAchievements = [
  { id: "1", name: "10 Games", description: "Played 10 games" },
  { id: "2", name: "Perfect Attendance", description: "No no-shows" },
  { id: "3", name: "50 Games", description: "Played 50 games" },
  { id: "4", name: "Team Captain", description: "Led a squad" },
];

export default function ProfileEditor() {
  const [, setLocation] = useLocation();
  const [displayName, setDisplayName] = useState("Alex Chen");
  const [username, setUsername] = useState("@alexchen");
  const [selectedTags, setSelectedTags] = useState(["Reliable", "Team Player", "Forward", "Punctual"]);
  const [selectedAchievements, setSelectedAchievements] = useState(["1", "2"]);

  const save = () => {
    toast.success("Profile updated");
    setLocation("/profile");
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
      return;
    }
    if (selectedTags.length >= 6) {
      toast.error("Maximum 6 tags");
      return;
    }
    setSelectedTags((prev) => [...prev, tag]);
  };

  const toggleAchievement = (id: string) => {
    if (selectedAchievements.includes(id)) {
      setSelectedAchievements((prev) => prev.filter((a) => a !== id));
      return;
    }
    setSelectedAchievements((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#0b0f18] pb-10">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f18]/95 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocation("/profile")}
            className="inline-flex items-center gap-1 rounded-xl border border-[#2f3b53] bg-[#11192a] px-3 py-2 text-xs font-semibold text-[#d2deee]"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-lg font-semibold text-white">Edit profile</h1>
          <button
            onClick={save}
            className="rounded-xl bg-[#a8ff3f] px-3 py-2 text-xs font-semibold text-[#10170e]"
          >
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 p-4">
        <section className="surface-card p-4">
          <h2 className="text-sm font-semibold text-white">Basic info</h2>
          <div className="mt-3 space-y-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="border-[#2f3a51] bg-[#0f1624] text-white"
            />
            <Input
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value.startsWith("@") || value === "" ? value : `@${value}`);
              }}
              placeholder="@username"
              className="border-[#2f3a51] bg-[#0f1624] text-white"
            />
          </div>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-semibold text-white">Player tags ({selectedTags.length}/6)</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    active
                      ? "border-[#a8ff3f] bg-[#1b2830] text-[#a8ff3f]"
                      : "border-[#32415d] bg-[#101726] text-[#d0dced]"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-semibold text-white">Achievements shown</h2>
          <div className="mt-3 space-y-2">
            {availableAchievements.map((achievement) => {
              const active = selectedAchievements.includes(achievement.id);
              return (
                <button
                  key={achievement.id}
                  onClick={() => toggleAchievement(achievement.id)}
                  className={`w-full rounded-2xl border p-3 text-left ${
                    active ? "border-[#a8ff3f] bg-[#182436]" : "border-[#31405a] bg-[#101726]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{achievement.name}</p>
                      <p className="text-xs text-[#9aadc9]">{achievement.description}</p>
                    </div>
                    {active && <Check className="h-4 w-4 text-[#a8ff3f]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
