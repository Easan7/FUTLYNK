import { useState } from "react";
import { useLocation } from "wouter";
import { Check, Flame, ShieldCheck, Star, Target, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import PitchOverlay from "@/components/PitchOverlay";

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
  { id: "1", name: "10 Games", description: "Consistency milestone", icon: Trophy },
  { id: "2", name: "Perfect Attendance", description: "No no-shows", icon: ShieldCheck },
  { id: "3", name: "50 Games", description: "Veteran player", icon: Flame },
  { id: "4", name: "Team Captain", description: "Led a squad", icon: Target },
  { id: "5", name: "Top Rated", description: "Strong peer ratings", icon: Star },
];

const avatarOptions = [
  { id: "pitch", label: "Pitch", bg: "bg-[#1f2a1f]", ring: "border-[#3f5a3f]", text: "text-[#dff0e1]" },
  { id: "lime", label: "Lime", bg: "bg-[#26331f]", ring: "border-[#6ea63f]", text: "text-[#ecf9e0]" },
  { id: "urban", label: "Urban", bg: "bg-[#222826]", ring: "border-[#3d4542]", text: "text-[#d8e3dc]" },
  { id: "forest", label: "Forest", bg: "bg-[#1c2c20]", ring: "border-[#4f7c59]", text: "text-[#e0efe4]" },
] as const;

const PROFILE_STORAGE_KEY = "futlynk_profile";

export default function ProfileEditor() {
  const [, setLocation] = useLocation();
  const savedProfile =
    typeof window !== "undefined" ? window.localStorage.getItem(PROFILE_STORAGE_KEY) : null;

  let parsedProfile: {
    displayName?: string;
    username?: string;
    selectedTags?: string[];
    selectedAchievements?: string[];
    avatarId?: string;
  } | null = null;

  if (savedProfile) {
    try {
      parsedProfile = JSON.parse(savedProfile);
    } catch {
      parsedProfile = null;
    }
  }

  const [displayName, setDisplayName] = useState(parsedProfile?.displayName ?? "Alex Chen");
  const [username, setUsername] = useState(parsedProfile?.username ?? "@alexchen");
  const [selectedAvatar, setSelectedAvatar] = useState(parsedProfile?.avatarId ?? "pitch");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    parsedProfile?.selectedTags ?? ["Reliable", "Team Player", "Forward", "Punctual"]
  );
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>(
    parsedProfile?.selectedAchievements ?? ["1", "2", "5"]
  );
  const [formError, setFormError] = useState("");
  const hasValidName = displayName.trim().length >= 2;
  const hasValidUsername = /^@[a-zA-Z0-9_]{3,20}$/.test(username);

  const save = () => {
    setFormError("");
    if (!hasValidName) {
      setFormError("Display name must be at least 2 characters.");
      return;
    }
    if (!hasValidUsername) {
      setFormError("Username must be @ + 3-20 letters, numbers, or underscores.");
      return;
    }
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName,
        username,
        avatarId: selectedAvatar,
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
    if (selectedAchievements.length >= 4) {
      toast.error("Select up to 4 achievements");
      return;
    }
    setSelectedAchievements((prev) => [...prev, id]);
  };

  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#070a08] pb-10">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm("Discard profile changes?")) {
                setLocation("/profile");
              }
            }}
            className="btn-secondary text-xs"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <h1 className="text-lg font-semibold text-[#f2f7f2]">Edit Profile</h1>
          <button onClick={save} className="btn-primary text-xs" disabled={!hasValidName || !hasValidUsername}>
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
            <p className="text-xs text-[#95a39a]">Username format: @name (3-20 chars, letters/numbers/_)</p>
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Avatar</h2>
          <div className="mt-3 flex items-center gap-3">
            {avatarOptions.map((avatar) => {
              const isActive = selectedAvatar === avatar.id;
              return (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`rounded-xl border p-2 text-center ${
                    isActive ? "border-[#88dd39] bg-[#1d261e]" : "border-[#2f372f] bg-[#141a15]"
                  }`}
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-full border ${avatar.ring} ${avatar.bg} text-xs font-semibold ${avatar.text}`}>
                    {initials}
                  </div>
                  <p className="mt-1 text-[10px] text-[#b7c5ba]">{avatar.label}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Player Tags ({selectedTags.length}/6)</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)} className={`chip ${active ? "chip-active" : ""}`}>
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Achievements ({selectedAchievements.length}/4)</h2>
          <div className="mt-3 space-y-2">
            {availableAchievements.map((achievement) => {
              const active = selectedAchievements.includes(achievement.id);
              const Icon = achievement.icon;
              return (
                <button
                  key={achievement.id}
                  onClick={() => toggleAchievement(achievement.id)}
                  className={`surface-inner w-full text-left ${active ? "border-[#88dd39]" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-[#384638] bg-[#1d261d] p-1.5">
                        <Icon className="h-3.5 w-3.5 text-[#9dff3f]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#edf3ee]">{achievement.name}</p>
                        <p className="text-xs text-[#95a39a]">{achievement.description}</p>
                      </div>
                    </div>
                    {active && <Check className="h-4 w-4 text-[#9dff3f]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        {formError ? <p className="rounded-lg border border-[#4a2f2f] bg-[#241717] px-3 py-2 text-xs text-[#e0bbbb]">{formError}</p> : null}
      </main>
    </div>
  );
}
