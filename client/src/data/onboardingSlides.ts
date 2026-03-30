export type OnboardingSlide = {
  id: string;
  label: string;
  title: string;
  description: string;
  accent: string;
  theme: "core" | "discover" | "groups" | "allinone";
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "welcome",
    label: "Welcome",
    title: "Football, sorted.",
    description: "Find games, link up with players, and manage your football plans in one seamless app.",
    accent: "from-[#b8ff6f] to-[#8fdd3d]",
    theme: "core",
  },
  {
    id: "discover",
    label: "Find & Join",
    title: "Find the right match.",
    description: "Discover open rooms by skill, location, and availability with fit labels that help you join faster.",
    accent: "from-[#b2ff5a] to-[#95e847]",
    theme: "discover",
  },
  {
    id: "group",
    label: "Group Play",
    title: "Plan better with your group.",
    description: "Track who can make it, view recommended games, and coordinate into the right session with less back-and-forth.",
    accent: "from-[#afff64] to-[#7ed93f]",
    theme: "groups",
  },
  {
    id: "all-in-one",
    label: "All-In-One",
    title: "Play, track, improve.",
    description: "Manage games, chats, profile, availability, ratings, rewards, and wallet activity in one place.",
    accent: "from-[#c4ff70] to-[#8bdc41]",
    theme: "allinone",
  },
];
