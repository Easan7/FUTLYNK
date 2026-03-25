export type RecentMatch3D = {
  id: string;
  date: string;
  venue: string;
  players: number;
  rating: number;
  importance: number;
  special?: "mvp" | "rivalry" | "clean-sheet";
};

export type Achievement3D = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: "common" | "rare" | "elite";
  category: "performance" | "consistency" | "social" | "group" | "fair-play";
  shape: "shield" | "coin" | "plaque" | "star" | "trophy";
};

export type PlayerCardData3D = {
  name: string;
  skill: string;
  tags: string[];
  games: number;
  reliability: number;
  sportsmanship: number;
  attendance: number;
  points: number;
};
