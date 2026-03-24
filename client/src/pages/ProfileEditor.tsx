import { useState } from "react";
import { useLocation } from "wouter";
import { Check, X } from "lucide-react";
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

const PROFILE_STORAGE_KEY = "futlynk_profile";

export default function ProfileEditor() {
  const [, setLocation] = useLocation();
  const savedProfile =
    typeof window !== "undefined" ? window.localStorage.getItem(PROFILE_STORAGE_KEY) : null;
  const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;

  const [displayName, setDisplayName] = useState(parsedProfile?.displayName ?? "Alex Chen");
  const [username, setUsername] = useState(parsedProfile?.username ?? "@alexchen");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    parsedProfile?.selectedTags ?? ["Reliable", "Team Player", "Forward", "Punctual"]
  );
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>(
    parsedProfile?.selectedAchievements ?? ["1", "2"]
  );

  const save = () => {
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName,
        username,
        selectedTags,
        selectedAchievements,
      })
    );
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
    <div className="min-h-screen bg-[#070a08] pb-10">
      <header className="app-header">
        <div className="flex items-center justify-between">
          <button onClick={() => setLocation("/profile")} className="btn-secondary text-xs">
            <X className="h-4 w-4" /> Cancel
          </button>
          <h1 className="text-lg font-semibold text-[#f2f7f2]">Edit Profile</h1>
          <button onClick={save} className="btn-primary text-xs">
            <Check className="h-4 w-4" /> Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-3 p-4">
        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Basic Info</h2>
          <div className="mt-3 space-y-2">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" />
            <Input
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value.startsWith("@") || value === "" ? value : `@${value}`);
              }}
              placeholder="@username"
            />
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Player Tags ({selectedTags.length}/6)</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`chip ${active ? "chip-active" : ""}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Achievements</h2>
          <div className="mt-3 space-y-2">
            {availableAchievements.map((achievement) => {
              const active = selectedAchievements.includes(achievement.id);
              return (
                <button
                  key={achievement.id}
                  onClick={() => toggleAchievement(achievement.id)}
                  className={`surface-inner w-full text-left ${active ? "border-[#88dd39]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#edf3ee]">{achievement.name}</p>
                      <p className="text-xs text-[#95a39a]">{achievement.description}</p>
                    </div>
                    {active && <Check className="h-4 w-4 text-[#9dff3f]" />}
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
