import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { Award, Bell, CalendarDays, Edit3, History, Tag, Users, Wallet } from "lucide-react";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import SkillBadge from "@/components/SkillBadge";
import type { SkillLevel } from "@/components/SkillBadge";
import PitchOverlay from "@/components/PitchOverlay";
import { apiGet, DEFAULT_USER_ID } from "@/lib/api";

const achievementsCatalog = [
  { id: "1", name: "10 Games", description: "Consistency milestone", category: "consistency", rarity: "common", shape: "coin" },
  { id: "2", name: "Perfect Attendance", description: "No no-shows", category: "fair-play", rarity: "rare", shape: "shield" },
  { id: "3", name: "50 Games", description: "Veteran player", category: "performance", rarity: "elite", shape: "trophy" },
  { id: "4", name: "Team Captain", description: "Led a squad", category: "group", rarity: "rare", shape: "plaque" },
  { id: "5", name: "Top Rated", description: "Strong peer ratings", category: "performance", rarity: "elite", shape: "star" },
  { id: "6", name: "Fair Play", description: "Sportsmanship recognized", category: "social", rarity: "common", shape: "shield" },
] as const;

const toSkillLevel = (value: string | undefined): SkillLevel =>
  value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Hybrid"
    ? value
    : "Intermediate";

type ProfilePayload = {
  profile: {
    id: string;
    displayName: string;
    username: string;
    publicSkillBand: string;
    reliabilityScore: number;
    gamesPlayed: number;
    avatarId: string;
    selectedTags: string[];
    selectedAchievements: string[];
    points: number;
    streakWeeks: number;
    walletBalance: number;
    recentMatches: Array<{ id: string; location: string; date: string; time: string; status: string }>;
    communityTags: string[];
  };
};

const avatarStyles: Record<string, { bg: string; ring: string; text: string }> = {
  pitch: { bg: "bg-[#1f2a1f]", ring: "border-[#3f5a3f]", text: "text-[#dff0e1]" },
  lime: { bg: "bg-[#26331f]", ring: "border-[#6ea63f]", text: "text-[#ecf9e0]" },
  urban: { bg: "bg-[#222826]", ring: "border-[#3d4542]", text: "text-[#d8e3dc]" },
  forest: { bg: "bg-[#1c2c20]", ring: "border-[#4f7c59]", text: "text-[#e0efe4]" },
};

export default function Profile() {
  const [isFriendRoute, routeParams] = useRoute("/profile/:id");
  const profileUserId = isFriendRoute ? routeParams?.id ?? DEFAULT_USER_ID : DEFAULT_USER_ID;
  const isOwnProfile = profileUserId === DEFAULT_USER_ID;
  const [profile, setProfile] = useState<ProfilePayload["profile"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const payload = await apiGet<ProfilePayload>(`/api/v1/profile?user_id=${profileUserId}`);
        setProfile(payload.profile);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [profileUserId]);

  const selectedAchievementItems = useMemo(() => {
    const selected = profile?.selectedAchievements ?? [];
    return achievementsCatalog.filter((a) => selected.includes(a.id));
  }, [profile?.selectedAchievements]);

  const displayName = profile?.displayName ?? "Alex Chen";
  const username = profile?.username ?? "@alexchen";
  const selectedTags = profile?.selectedTags ?? ["Reliable", "Team Player", "Forward", "Punctual"];
  const communityTags = profile?.communityTags ?? [];
  const recentMatches = profile?.recentMatches ?? [];
  const avatarStyle = avatarStyles[profile?.avatarId ?? "pitch"] ?? avatarStyles.pitch;
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading && !profile) {
    return (
      <div className="app-shell">
        <FootballLoader fullScreen label="Loading profile..." />
        <Navigation />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center justify-between">
          <h1 className="relative z-10 text-2xl font-semibold text-[#f2f7f2]">Profile</h1>
          <div className="relative z-10 flex items-center gap-2">
            {isOwnProfile ? (
              <>
                <Link href="/notifications" className="btn-secondary !min-h-10 !px-3" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Link>
                <Link href="/profile/edit" className="btn-secondary !min-h-10 !px-3" aria-label="Edit profile">
                  <Edit3 className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <Link href="/friends" className="btn-secondary !min-h-10 !px-3 text-xs">
                Back
              </Link>
            )}
          </div>
        </div>

        {isOwnProfile ? (
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
        ) : null}
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card pitch-lines">
          <div className="flex items-center gap-3">
            <div className={`grid h-14 w-14 place-items-center rounded-full border-2 text-lg font-semibold ${avatarStyle.bg} ${avatarStyle.ring} ${avatarStyle.text}`}>
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#f2f7f2]">{displayName}</h2>
              <p className="mt-0.5 text-xs text-[#96a39a]">{username}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <SkillBadge level={toSkillLevel(profile?.publicSkillBand)} colored />
                {isOwnProfile ? (
                  <span className="rounded-full border border-[#557f31] bg-[#203119] px-2.5 py-1 text-xs font-semibold text-[#c6f59a]">
                    FutPoints {profile?.points ?? 0}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-[#2f372f] pt-3 text-sm">
            <div className="flex items-center justify-between border-b border-[#222a23] py-2">
              <span className="text-[#95a39a]">Games Played</span>
              <span className="font-semibold text-[#edf3ee]">{profile?.gamesPlayed ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#222a23] py-2">
              <span className="text-[#95a39a]">Reliability</span>
              <span className="font-semibold text-[#edf3ee]">{profile?.reliabilityScore ?? 0}%</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#222a23] py-2">
              <span className="text-[#95a39a]">Current Streak</span>
              <span className="font-semibold text-[#edf3ee]">{profile?.streakWeeks ?? 0} weeks</span>
            </div>
          </div>
        </section>

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <Tag className="h-4 w-4 text-[#9dff3f]" />Player Tags
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <span key={tag} className="chip chip-active">
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-xs text-[#95a39a]">No tags selected yet.</p>
            )}
          </div>
        </section>

        {communityTags.length > 0 ? (
          <section className="surface-card">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
              <Tag className="h-4 w-4 text-[#9dff3f]" /> Community Tags
            </h3>
            <p className="mt-1 text-sm text-[#99a79e]">Earned from player ratings (more than 5 votes).</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {communityTags.map((tag) => (
                <span key={tag} className="chip chip-active">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <Award className="h-4 w-4 text-[#9dff3f]" /> Achievements
          </h3>
          <div className="mt-3 space-y-2">
            {selectedAchievementItems.length > 0 ? (
              selectedAchievementItems.map((achievement) => (
                <div key={achievement.id} className="surface-inner">
                  <p className="text-sm font-semibold text-[#edf3ee]">{achievement.name}</p>
                  <p className="mt-1 text-xs text-[#95a39a]">{achievement.description}</p>
                </div>
              ))
            ) : (
              <div className="surface-inner">
                <p className="text-xs text-[#95a39a]">No achievements selected yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <History className="h-4 w-4 text-[#9dff3f]" /> Past Matches
          </h3>
          <div className="mt-3 space-y-2">
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div key={match.id} className="surface-inner flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#eef4ef]">{match.location}</p>
                    <p className="mt-0.5 text-xs text-[#95a39a]">
                      {match.date} · {match.time}
                    </p>
                  </div>
                  <span className="chip">{match.status === "completed" ? "Completed" : "Played"}</span>
                </div>
              ))
            ) : (
              <div className="surface-inner">
                <p className="text-xs text-[#95a39a]">No past matches yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
