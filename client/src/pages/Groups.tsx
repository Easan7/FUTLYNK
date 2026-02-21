/**
 * Groups Page - Unique Design
 * View groups list and click into groups to see availability, game selection, and chat
 */

import { useState } from "react";
import { Link } from "wouter";
import { Users, Plus, ArrowLeft, Send, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
  members: Array<{ name: string; availability: string[] }>;
  skillMix: "Same" | "Mixed";
}

const mockGroups: Group[] = [
  {
    id: 1,
    name: "Weekend Warriors",
    members: [
      { name: "You", availability: ["Sat 6PM", "Sun 10AM", "Sun 6PM"] },
      { name: "Marcus Chen", availability: ["Sat 6PM", "Sun 6PM"] },
      { name: "Sarah Williams", availability: ["Sat 6PM", "Sun 10AM"] },
      { name: "Diego Martinez", availability: ["Sun 6PM"] },
    ],
    skillMix: "Mixed",
  },
  {
    id: 2,
    name: "Friday Night Futsal",
    members: [
      { name: "You", availability: ["Fri 7PM", "Fri 9PM"] },
      { name: "Aisha Patel", availability: ["Fri 7PM"] },
      { name: "Tom Rodriguez", availability: ["Fri 7PM", "Fri 9PM"] },
    ],
    skillMix: "Same",
  },
];

const mockGames = [
  {
    id: "g1",
    location: "Downtown Sports Arena",
    date: "Sat, Feb 15",
    time: "6:00 PM",
    price: 15,
    availableMembers: ["You", "Marcus Chen", "Sarah Williams"],
    selectedBy: ["You", "Marcus Chen"],
  },
  {
    id: "g2",
    location: "Metro Futsal Complex",
    date: "Sun, Feb 16",
    time: "10:00 AM",
    price: 18,
    availableMembers: ["You", "Sarah Williams"],
    selectedBy: [],
  },
  {
    id: "g3",
    location: "Westgate Indoor Sports",
    date: "Sun, Feb 16",
    time: "6:00 PM",
    price: 15,
    availableMembers: ["You", "Marcus Chen", "Diego Martinez"],
    selectedBy: ["You", "Marcus Chen", "Diego Martinez"],
  },
];

export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { user: "Marcus Chen", message: "Who's in for Saturday?", time: "2h ago" },
    { user: "Sarah Williams", message: "I can make it!", time: "1h ago" },
  ]);
  const [gameSelections, setGameSelections] = useState<Record<string, string[]>>({
    "g1": ["You", "Marcus Chen"],
    "g2": [],
    "g3": ["You", "Marcus Chen", "Diego Martinez"],
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { user: "You", message: chatMessage, time: "Just now" },
    ]);
    setChatMessage("");
    toast.success("Message sent!");
  };

  const handleGameSelection = (gameId: string) => {
    setGameSelections(prev => {
      const currentSelections = prev[gameId] || [];
      const isSelected = currentSelections.includes("You");
      
      if (isSelected) {
        // Remove "You" from selections
        return {
          ...prev,
          [gameId]: currentSelections.filter(name => name !== "You")
        };
      } else {
        // Add "You" to selections
        return {
          ...prev,
          [gameId]: [...currentSelections, "You"]
        };
      }
    });
    toast.success("Game selection updated!");
  };

  if (selectedGroup) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedGroup(null)}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">{selectedGroup.name}</h1>
              <p className="text-xs text-gray-500">
                {selectedGroup.members.length} members • {selectedGroup.skillMix} skill mix
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Weekly Availability */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Weekly Availability
            </h2>
            <div className="bg-[#1a1a1a] p-4 space-y-3">
              {selectedGroup.members.map((member) => (
                <div key={member.name} className="space-y-2">
                  <p className="text-white text-sm font-medium">{member.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.availability.map((slot) => (
                      <span
                        key={slot}
                        className="px-2 py-1 bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs rounded"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Games */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Potential Games
            </h2>
            {mockGames.map((game) => {
              const selectedBy = gameSelections[game.id] || [];
              const allSelected = game.availableMembers.every((m) =>
                selectedBy.includes(m)
              );
              return (
                <div key={game.id} className="bg-[#1a1a1a] p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{game.location}</h3>
                      <p className="text-gray-400 text-sm">
                        {game.date} • {game.time} • ${game.price}
                      </p>
                    </div>
                    {allSelected && (
                      <span className="px-2 py-1 bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] text-xs rounded font-bold">
                        AUTO-JOIN
                      </span>
                    )}
                  </div>

                  {/* Who can make it */}
                  <div>
                    <p className="text-[10px] uppercase text-gray-500 tracking-wide mb-2">
                      Available Members ({game.availableMembers.length})
                    </p>
                    <div className="space-y-1">
                      {game.availableMembers.map((member) => {
                        const isSelected = selectedBy.includes(member);
                        return (
                          <div key={member} className="flex items-center gap-2 text-sm">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "bg-[#39ff14] border-[#39ff14]"
                                  : "border-gray-600"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-black" />
                              )}
                            </div>
                            <span
                              className={
                                isSelected
                                  ? "text-white"
                                  : "text-gray-500"
                              }
                            >
                              {member}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select button */}
                  <button
                    onClick={() => handleGameSelection(game.id)}
                    className={`w-full py-2 rounded font-bold text-sm transition-colors ${
                      selectedBy.includes("You")
                        ? "bg-[#1a1a1a] border border-[#39ff14] text-[#39ff14]"
                        : "bg-[#39ff14] text-black hover:bg-[#2de00f]"
                    }`}
                  >
                    {selectedBy.includes("You") ? "Selected" : "Select Game"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Group Chat */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Group Chat
            </h2>
            <div className="bg-[#1a1a1a] p-4 space-y-3 max-h-64 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium">{msg.user}</p>
                    <span className="text-gray-600 text-xs">{msg.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-[#39ff14] text-black rounded hover:bg-[#2de00f] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <Navigation />
      </div>
    );
  }

  // Groups List View
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Groups</h1>
          <Link href="/create">
            <button className="p-2 bg-[#39ff14] text-black rounded-lg hover:bg-[#2de00f] transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-400">
          Manage your social groups and find games together
        </p>

        {mockGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className="w-full bg-[#1a1a1a] hover:bg-[#222222] transition-colors p-4 text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">{group.name}</h3>
                <p className="text-gray-400 text-sm">
                  {group.members.length} members • {group.skillMix} skill mix
                </p>
              </div>
              <div className="flex -space-x-2">
                {group.members.slice(0, 3).map((member, idx) => (
                  <Avatar key={idx} className="w-8 h-8 border-2 border-[#0a0a0a]">
                    <AvatarFallback className="bg-[#39ff14]/20 text-[#39ff14] text-xs">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <Navigation />
    </div>
  );
}
