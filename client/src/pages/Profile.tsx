import { useMemo } from "react";
import { Link } from "wouter";
import { Bell, CalendarDays, Clock3, Edit3, Users, Wallet } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import { currentUser } from "@/data/mockData";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import PlayerJourney3D from "@/components/profile3d/PlayerJourney3D";
import { loadPlayerProgress } from "@/lib/playerProgress";
import type { Achievement3D } from "@/components/profile3d/shared/types";

const PROFILE_STORAGE_KEY = "futlynk_profile";

const avatarOptions = {
  pitch: { label: "Pitch", bg: "bg-[#1f2a1f]", ring: "border-[#3f5a3f]", text: "text-[#dff0e1]" },
  lime: { label: "Lime", bg: "bg-[#26331f]", ring: "border-[#6ea63f]", text: "text-[#ecf9e0]" },
  urban: { label: "Urban", bg: "bg-[#222826]", ring: "border-[#3d4542]", text: "text-[#d8e3dc]" },
  forest: { label: "Forest", bg: "bg-[#1c2c20]", ring: "border-[#4f7c59]", text: "text-[#e0efe4]" },
} as const;

const achievementsCatalog = [
  { id: "1", name: "10 Games", description: "Consistency milestone", category: "consistency", rarity: "common", shape: "coin" },
  { id: "2", name: "Perfect Attendance", description: "No no-shows", category: "fair-play", rarity: "rare", shape: "shield" },
  { id: "3", name: "50 Games", description: "Veteran player", category: "performance", rarity: "elite", shape: "trophy" },
  { id: "4", name: "Team Captain", description: "Led a squad", category: "group", rarity: "rare", shape: "plaque" },
  { id: "5", name: "Top Rated", description: "Strong peer ratings", category: "performance", rarity: "elite", shape: "star" },
  { id: "6", name: "Fair Play", description: "Sportsmanship recognized", category: "social", rarity: "common", shape: "shield" },
] as const;

const matchHistory = [
  { id: "m1", date: "Mar 20", venue: "Downtown Sports Arena", result: "W 8-6", players: 10, rating: 4.4, importance: 0.8, special: "mvp" as const },
  { id: "m2", date: "Mar 16", venue: "Metro Futsal Complex", result: "L 5-7", players: 9, rating: 3.9, importance: 0.6, special: "rivalry" as const },
  { id: "m3", date: "Mar 12", venue: "Westgate Indoor Sports", result: "W 6-4", players: 10, rating: 4.2, importance: 0.7, special: "clean-sheet" as const },
  { id: "m4", date: "Mar 09", venue: "Eastside Court", result: "W 8-5", players: 8, rating: 4.1, importance: 0.55 },
];

export default function Profile() {
  let parsedProfile: {
    displayName?: string;
    username?: string;
    selectedTags?: string[];
    selectedAchievements?: string[];
    avatarId?: keyof typeof avatarOptions;
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

  const progress = loadPlayerProgress();
  const displayName = parsedProfile?.displayName ?? currentUser.name;
  const selectedTags = parsedProfile?.selectedTags ?? ["Reliable", "Team Player", "Forward", "Punctual"];
  const avatarId = parsedProfile?.avatarId ?? "pitch";
  const avatarTheme = avatarOptions[avatarId] ?? avatarOptions.pitch;
  const totalGamesPlayed = currentUser.gamesPlayed + progress.gamesLogged;

  const achievements3d: Achievement3D[] = useMemo(() => {
    const selected = parsedProfile?.selectedAchievements ?? ["1", "2", "5", "6"];
    return achievementsCatalog.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      unlocked: selected.includes(a.id),
      unlockedDate: selected.includes(a.id) ? "Mar 2026" : undefined,
      rarity: a.rarity as Achievement3D["rarity"],
      category: a.category as Achievement3D["category"],
      shape: a.shape as Achievement3D["shape"],
    }));
  }, [parsedProfile]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <h1 className="relative z-10 text-2xl font-semibold text-[#f2f7f2]">Profile</h1>
          <div className="relative z-10 flex items-center gap-2">
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

        <div className="relative z-10 mt-3 grid grid-cols-3 gap-2">
          <Link href="/friends">
            <button className="btn-secondary w-full">
              <Users className="h-4 w-4" /> Friends
            </button>
          </Link>
          <Link href="/availability">
            <button className="btn-secondary w-full">
              <CalendarDays className="h-4 w-4" /> Availability
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
            <div
              className={`grid h-14 w-14 place-items-center rounded-full border-2 ${avatarTheme.ring} ${avatarTheme.bg} text-lg font-semibold ${avatarTheme.text}`}
              title={avatarTheme.label}
            >
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
                <span className="text-xs text-[#93a198]">{selectedTags.slice(0, 3).join(" • ")}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatBlock label="Games" value={totalGamesPlayed} />
            <StatBlock label="Reliability" value={`${currentUser.reliabilityScore}%`} />
            <StatBlock label="Points" value={progress.points} subValue="FutPoints" />
          </div>
        </section>

        <PlayerJourney3D
          cardData={{
            name: displayName,
            skill: currentUser.publicSkillBand,
            tags: selectedTags,
            games: totalGamesPlayed,
            reliability: currentUser.reliabilityScore,
            sportsmanship: 94,
            attendance: currentUser.reliabilityScore,
            points: progress.points,
          }}
          achievements={achievements3d}
          snapshot={{
            strongestVenue: "Downtown Sports Arena",
            lastResult: matchHistory[0]?.result ?? "W 0-0",
            formLastFive: "W-W-L-W-D",
            avgRating: 4.2,
            groupGames: 12,
            fairPlayScore: 94,
            nextFocus: "Keep consistency in high-tempo midweek games",
          }}
        />

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <Clock3 className="h-4 w-4 text-[#9dff3f]" /> Match Results
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
