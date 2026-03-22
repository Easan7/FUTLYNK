export type SkillBand = "Beginner" | "Intermediate" | "Advanced";

export type Player = {
  id: string;
  name: string;
  publicSkillBand: SkillBand;
  hiddenSkillRating: number;
  reliabilityScore: number;
  gamesPlayed: number;
  tags: string[];
  isOnline?: boolean;
  joinedViaGroupId?: string | null;
};

export type Room = {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  distanceKm: number;
  price: number;
  playersJoined: number;
  maxPlayers: number;
  allowedBand: SkillBand | null;
  hiddenAvgRating: number;
  hiddenRatingSpread: number;
  weekTag: "This week" | "Next week";
  matchingAvailability: boolean;
};

export type Group = {
  id: string;
  name: string;
  memberIds: string[];
  availability: Record<string, string[]>;
  recentSquadMemberIds: string[];
};

export const currentUser = {
  id: "u-me",
  name: "Alex Chen",
  publicSkillBand: "Intermediate" as SkillBand,
  hiddenSkillRating: 3.35,
  reliabilityScore: 96,
  gamesPlayed: 47,
  streakWeeks: 6,
};

export const players: Player[] = [
  {
    id: "u-me",
    name: "Alex Chen",
    publicSkillBand: "Intermediate",
    hiddenSkillRating: 3.35,
    reliabilityScore: 96,
    gamesPlayed: 47,
    tags: ["Reliable", "Forward", "Team Player"],
    isOnline: true,
  },
  {
    id: "u-1",
    name: "Marcus Chen",
    publicSkillBand: "Advanced",
    hiddenSkillRating: 4.28,
    reliabilityScore: 98,
    gamesPlayed: 127,
    tags: ["Fast Press", "Leader", "Punctual"],
    isOnline: true,
  },
  {
    id: "u-2",
    name: "Sarah Williams",
    publicSkillBand: "Intermediate",
    hiddenSkillRating: 3.22,
    reliabilityScore: 95,
    gamesPlayed: 64,
    tags: ["Calm Finisher", "Reliable"],
    isOnline: true,
  },
  {
    id: "u-3",
    name: "Diego Martinez",
    publicSkillBand: "Advanced",
    hiddenSkillRating: 4.1,
    reliabilityScore: 92,
    gamesPlayed: 98,
    tags: ["Competitive", "Wing Runner"],
    isOnline: false,
  },
  {
    id: "u-4",
    name: "Aisha Patel",
    publicSkillBand: "Intermediate",
    hiddenSkillRating: 3.05,
    reliabilityScore: 97,
    gamesPlayed: 52,
    tags: ["Supportive", "Organizer"],
    isOnline: true,
  },
  {
    id: "u-5",
    name: "Tom Rodriguez",
    publicSkillBand: "Beginner",
    hiddenSkillRating: 2.18,
    reliabilityScore: 90,
    gamesPlayed: 34,
    tags: ["Learner", "Energetic"],
    isOnline: false,
  },
  {
    id: "u-6",
    name: "Jamie Wilson",
    publicSkillBand: "Intermediate",
    hiddenSkillRating: 3.48,
    reliabilityScore: 94,
    gamesPlayed: 59,
    tags: ["Defensive IQ", "Calm"],
    isOnline: true,
  },
  {
    id: "u-7",
    name: "Chris Taylor",
    publicSkillBand: "Beginner",
    hiddenSkillRating: 2.45,
    reliabilityScore: 89,
    gamesPlayed: 29,
    tags: ["Developing", "Punctual"],
    isOnline: false,
  },
];

export const rooms: Room[] = [
  {
    id: "1",
    title: "Balanced Midweek 5v5",
    location: "Downtown Sports Arena",
    date: "Tue, Mar 24",
    time: "7:30 PM",
    distanceKm: 0.9,
    price: 15,
    playersJoined: 8,
    maxPlayers: 10,
    allowedBand: "Intermediate",
    hiddenAvgRating: 3.3,
    hiddenRatingSpread: 0.35,
    weekTag: "This week",
    matchingAvailability: true,
  },
  {
    id: "2",
    title: "Open Mix Night",
    location: "Metro Futsal Complex",
    date: "Wed, Mar 25",
    time: "8:00 PM",
    distanceKm: 1.4,
    price: 18,
    playersJoined: 6,
    maxPlayers: 10,
    allowedBand: null,
    hiddenAvgRating: 3.45,
    hiddenRatingSpread: 0.7,
    weekTag: "This week",
    matchingAvailability: true,
  },
  {
    id: "3",
    title: "Intermediate Tempo Session",
    location: "Westgate Indoor Sports",
    date: "Thu, Mar 26",
    time: "7:00 PM",
    distanceKm: 2.2,
    price: 16,
    playersJoined: 5,
    maxPlayers: 10,
    allowedBand: "Intermediate",
    hiddenAvgRating: 3.15,
    hiddenRatingSpread: 0.3,
    weekTag: "This week",
    matchingAvailability: false,
  },
  {
    id: "4",
    title: "Advanced Pressure Game",
    location: "Riverside Hub",
    date: "Fri, Mar 27",
    time: "9:00 PM",
    distanceKm: 3.2,
    price: 20,
    playersJoined: 9,
    maxPlayers: 10,
    allowedBand: "Advanced",
    hiddenAvgRating: 4.2,
    hiddenRatingSpread: 0.25,
    weekTag: "This week",
    matchingAvailability: false,
  },
  {
    id: "5",
    title: "Sunday Recovery Mix",
    location: "Eastside Court",
    date: "Sun, Mar 29",
    time: "10:00 AM",
    distanceKm: 1.8,
    price: 14,
    playersJoined: 4,
    maxPlayers: 10,
    allowedBand: null,
    hiddenAvgRating: 3.0,
    hiddenRatingSpread: 0.8,
    weekTag: "This week",
    matchingAvailability: true,
  },
];

export const groups: Group[] = [
  {
    id: "g-1",
    name: "Weekend Warriors",
    memberIds: ["u-me", "u-1", "u-2", "u-3", "u-7"],
    availability: {
      "Tue 7:30 PM": ["u-me", "u-2", "u-3"],
      "Wed 8:00 PM": ["u-me", "u-1", "u-2", "u-7"],
      "Sun 10:00 AM": ["u-me", "u-2", "u-7"],
    },
    recentSquadMemberIds: ["u-me", "u-2", "u-3"],
  },
  {
    id: "g-2",
    name: "Friday Core",
    memberIds: ["u-me", "u-2", "u-4", "u-6"],
    availability: {
      "Thu 7:00 PM": ["u-me", "u-2", "u-6"],
      "Fri 8:30 PM": ["u-me", "u-2", "u-4", "u-6"],
      "Sun 10:00 AM": ["u-me", "u-4"],
    },
    recentSquadMemberIds: ["u-me", "u-4", "u-6"],
  },
];

export type FitLabel = "Best fit for you" | "Highly balanced" | "Good fit" | "Similar level players";

export function getAllowedRoomsForUser(userBand: SkillBand) {
  return rooms.filter((room) => room.allowedBand === null || room.allowedBand === userBand);
}

export function getRoomFitScore(userRating: number, room: Room) {
  const ratingDistance = Math.abs(room.hiddenAvgRating - userRating);
  const distancePenalty = Math.min(room.distanceKm * 6, 20);
  const spreadPenalty = Math.min(room.hiddenRatingSpread * 16, 18);
  const availabilityBoost = room.matchingAvailability ? 12 : 0;
  const fillBoost = room.playersJoined >= 7 ? 10 : room.playersJoined >= 5 ? 6 : 3;

  return Math.max(30, Math.round(100 - ratingDistance * 30 - spreadPenalty - distancePenalty + availabilityBoost + fillBoost));
}

export function getFitLabel(fitScore: number): FitLabel {
  if (fitScore >= 86) return "Best fit for you";
  if (fitScore >= 76) return "Highly balanced";
  if (fitScore >= 66) return "Good fit";
  return "Similar level players";
}

export function getFitReason(room: Room, fitScore: number) {
  if (fitScore >= 86) return "Strong skill alignment and stable room balance";
  if (room.matchingAvailability) return "Matches your availability and expected pace";
  if (room.hiddenRatingSpread <= 0.4) return "Tight skill spread for a cleaner game";
  return "Suitable room with comparable level players";
}

export function getGroupSkillSummary(group: Group) {
  const members = group.memberIds
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean) as Player[];

  const counts = members.reduce(
    (acc, m) => {
      acc[m.publicSkillBand] += 1;
      return acc;
    },
    { Beginner: 0, Intermediate: 0, Advanced: 0 } as Record<SkillBand, number>
  );

  const activeBands = Object.values(counts).filter((v) => v > 0).length;
  return {
    counts,
    profile: activeBands > 1 ? "Mixed" : "Same-level",
    avgRating:
      members.reduce((sum, m) => sum + m.hiddenSkillRating, 0) /
      Math.max(members.length, 1),
  };
}

export function getGroupOverlapSlots(group: Group) {
  const slots = Object.entries(group.availability).map(([slot, memberIds]) => ({
    slot,
    memberIds,
    count: memberIds.length,
  }));

  return slots.sort((a, b) => b.count - a.count).slice(0, 3);
}

export function getGroupRecommendedRooms(group: Group) {
  const skill = getGroupSkillSummary(group);
  const topSlots = getGroupOverlapSlots(group).map((s) => s.slot);

  return rooms
    .filter((room) => {
      if (skill.profile === "Same-level") {
        const mainBand = (Object.entries(skill.counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Intermediate") as SkillBand;
        return room.allowedBand === null || room.allowedBand === mainBand;
      }
      return room.allowedBand === null || room.allowedBand === "Intermediate";
    })
    .map((room) => {
      const roomSlot = `${room.date.split(",")[0]} ${room.time}`;
      const matchedSlot = topSlots.find((s) => s.toLowerCase().includes(room.time.toLowerCase()) || roomSlot.toLowerCase().includes(s.split(" ")[0].toLowerCase()));
      const availableMemberCount = matchedSlot
        ? group.availability[matchedSlot]?.length ?? Math.ceil(group.memberIds.length * 0.5)
        : Math.max(2, Math.floor(group.memberIds.length * 0.5));

      const fitScore = Math.max(50, Math.round(100 - Math.abs(skill.avgRating - room.hiddenAvgRating) * 24 - room.hiddenRatingSpread * 12 + availableMemberCount * 4));

      return {
        room,
        availableMemberCount,
        fitScore,
        fitLabel: getFitLabel(fitScore),
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);
}

export const completedGameFeedback = {
  id: "c1",
  location: "Downtown Sports Arena",
  date: "Mar 20, 2026",
  time: "7:00 PM",
  currentUserJoinGroupId: "g-2",
  players: [
    { id: "u-2", name: "Sarah Williams", joinedViaGroupId: "g-2" },
    { id: "u-4", name: "Aisha Patel", joinedViaGroupId: "g-2" },
    { id: "u-6", name: "Jamie Wilson", joinedViaGroupId: "g-2" },
    { id: "u-1", name: "Marcus Chen", joinedViaGroupId: "g-1" },
    { id: "u-3", name: "Diego Martinez", joinedViaGroupId: null },
    { id: "u-7", name: "Chris Taylor", joinedViaGroupId: null },
  ],
};
