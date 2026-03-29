import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Bell, CalendarDays, Clock3, Edit3, Users, Wallet } from "lucide-react";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import type { SkillLevel } from "@/components/SkillBadge";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import PlayerJourney3D from "@/components/profile3d/PlayerJourney3D";
import type { Achievement3D } from "@/components/profile3d/shared/types";
import { apiGet, DEFAULT_USER_ID } from "@/lib/api";

const achievementsCatalog = [
  { id: "1", name: "10 Games", description: "Consistency milestone", category: "consistency", rarity: "common", shape: "coin" },
  { id: "2", name: "Perfect Attendance", description: "No no-shows", category: "fair-play", rarity: "rare", shape: "shield" },
  { id: "3", name: "50 Games", description: "Veteran player", category: "performance", rarity: "elite", shape: "trophy" },
  { id: "4", name: "Team Captain", description: "Led a squad", category: "group", rarity: "rare", shape: "plaque" },
  { id: "5", name: "Top Rated", description: "Strong peer ratings", category: "performance", rarity: "elite", shape: "star" },
  { id: "6", name: "Fair Play", description: "Sportsmanship recognized", category: "social", rarity: "common", shape: "shield" },
] as const;

const matchHistory = [
  { id: "m1", date: "Mar 20", venue: "Downtown Sports Arena", result: "W 8-6" },
  { id: "m2", date: "Mar 16", venue: "Metro Futsal Complex", result: "L 5-7" },
  { id: "m3", date: "Mar 12", venue: "Westgate Indoor Sports", result: "W 6-4" },
  { id: "m4", date: "Mar 09", venue: "Eastside Court", result: "W 8-5" },
];

const toSkillLevel = (value: string | undefined): SkillLevel =>
  value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Hybrid"
    ? value
    : "Intermediate";

type ProfilePayload = {
  profile: {
    displayName: string;
    username: string;
    publicSkillBand: string;
    reliabilityScore: number;
    gamesPlayed: number;
    avatarId: string;
    selectedTags: string[];
    selectedAchievements: string[];
    points: number;
  };
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfilePayload["profile"] | null>(null);

  useEffect(() => {
    const load = async () => {
      const payload = await apiGet<ProfilePayload>(`/api/v1/profile?user_id=${DEFAULT_USER_ID}`);
      setProfile(payload.profile);
    };

    void load();
  }, []);

  const achievements3d: Achievement3D[] = useMemo(() => {
    const selected = profile?.selectedAchievements ?? ["1", "2", "5", "6"];
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
  }, [profile?.selectedAchievements]);

  const displayName = profile?.displayName ?? "Alex Chen";
  const selectedTags = profile?.selectedTags ?? ["Reliable", "Team Player", "Forward", "Punctual"];

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <h1 className="relative z-10 text-2xl font-semibold text-[#f2f7f2]">Profile</h1>
          <div className="relative z-10 flex items-center gap-2">
            <Link href="/notifications" className="btn-secondary !min-h-10 !px-3" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Link>
            <Link href="/profile/edit" className="btn-secondary !min-h-10 !px-3" aria-label="Edit profile">
              <Edit3 className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-3 gap-2">
          <Link href="/friends" className="btn-secondary w-full">
            <Users className="h-4 w-4" /> Friends
          </Link>
          <Link href="/availability" className="btn-secondary w-full">
            <CalendarDays className="h-4 w-4" /> Availability
          </Link>
          <Link href="/wallet" className="btn-primary w-full">
            <Wallet className="h-4 w-4" /> Wallet
          </Link>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card pitch-lines">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#3f5a3f] bg-[#1f2a1f] text-lg font-semibold text-[#dff0e1]">
              {displayName
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#f2f7f2]">{displayName}</h2>
              <div className="mt-1 flex items-center gap-2">
                <SkillBadge level={toSkillLevel(profile?.publicSkillBand)} colored />
                <span className="text-xs text-[#93a198]">{selectedTags.slice(0, 3).join(" • ")}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatBlock label="Games" value={profile?.gamesPlayed ?? 0} />
            <StatBlock label="Reliability" value={`${profile?.reliabilityScore ?? 0}%`} />
            <StatBlock label="Points" value={profile?.points ?? 0} subValue="FutPoints" />
          </div>
        </section>

        <PlayerJourney3D
          cardData={{
            name: displayName,
            skill: profile?.publicSkillBand ?? "Intermediate",
            tags: selectedTags,
            games: profile?.gamesPlayed ?? 0,
            reliability: profile?.reliabilityScore ?? 0,
            sportsmanship: 94,
            attendance: profile?.reliabilityScore ?? 0,
            points: profile?.points ?? 0,
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
