/**
 * Profile Editor - Full Page Experience
 * Modern UI with section-based layout and inline editing
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const availableTags = [
  "Reliable", "Team Player", "Forward", "Midfielder", "Defender", 
  "Goalkeeper", "Punctual", "Aggressive", "Technical", "Fast"
];

const availableAchievements = [
  { id: "1", name: "10 Games", description: "Played 10 games" },
  { id: "2", name: "Perfect Attendance", description: "Never missed a game" },
  { id: "3", name: "50 Games", description: "Played 50 games" },
  { id: "4", name: "Team Captain", description: "Led a team to victory" },
  { id: "5", name: "Hat Trick", description: "Scored 3 goals in one game" },
  { id: "6", name: "Clean Sheet", description: "Goalkeeper with no goals conceded" },
];

export default function ProfileEditor() {
  const [, setLocation] = useLocation();
  const [displayName, setDisplayName] = useState("Alex Chen");
  const [username, setUsername] = useState("@alexchen");
  const [selectedTags, setSelectedTags] = useState(["Reliable", "Team Player", "Forward", "Punctual"]);
  const [selectedAchievements, setSelectedAchievements] = useState(["1", "2"]);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setLocation("/profile");
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 6) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        toast.error("Maximum 6 tags allowed");
      }
    }
  };

  const toggleAchievement = (id: string) => {
    if (selectedAchievements.includes(id)) {
      setSelectedAchievements(selectedAchievements.filter(a => a !== id));
    } else {
      setSelectedAchievements([...selectedAchievements, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setLocation("/profile")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Cancel</span>
          </button>
          <h1 className="text-lg font-bold text-white">Edit Profile</h1>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#39ff14] text-black rounded-lg font-bold hover:bg-[#2de00f] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Profile Picture Section */}
        <section className="flex flex-col items-center space-y-4 py-6">
          <Avatar className="w-32 h-32 border-4 border-[#2a2a2a]">
            <AvatarFallback className="bg-gradient-to-br from-[#39ff14]/20 to-cyan-500/20 text-white text-4xl font-bold">
              AC
            </AvatarFallback>
          </Avatar>
          <button className="text-[#39ff14] hover:text-[#2de00f] font-medium transition-colors">
            Change Photo
          </button>
        </section>

        {/* Basic Info Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white">Basic Information</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Display Name
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white text-lg py-6 focus:border-[#39ff14] transition-all"
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <Input
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("@") || value === "") {
                      setUsername(value);
                    } else {
                      setUsername("@" + value);
                    }
                  }}
                  className="bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white text-lg py-6 focus:border-[#39ff14] transition-all"
                  placeholder="@username"
                />
                {username && username !== "@" && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Check className="w-5 h-5 text-[#39ff14]" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Your unique identifier on FutLynk
              </p>
            </div>
          </div>
        </section>

        {/* Player Tags Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Player Tags</h2>
            <p className="text-sm text-gray-400">
              Select up to 6 tags that describe your playing style ({selectedTags.length}/6)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    isSelected
                      ? "bg-[#39ff14] text-black shadow-lg shadow-[#39ff14]/20"
                      : "bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:border-[#39ff14]/50 hover:text-white"
                  }`}
                >
                  {tag}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-black/20"
                    >
                      <Check className="w-3 h-3" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Achievements</h2>
            <p className="text-sm text-gray-400">
              Choose which achievements to display on your profile
            </p>
          </div>

          <div className="space-y-3">
            {availableAchievements.map((achievement) => {
              const isSelected = selectedAchievements.includes(achievement.id);
              const isUnlocked = parseInt(achievement.id) <= 2; // Mock: first 2 are unlocked
              
              return (
                <button
                  key={achievement.id}
                  onClick={() => isUnlocked && toggleAchievement(achievement.id)}
                  disabled={!isUnlocked}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    !isUnlocked
                      ? "bg-[#0f0f0f] border-[#1a1a1a] opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-[#1a1a1a] border-[#39ff14]"
                      : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#39ff14]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isUnlocked ? "bg-gradient-to-br from-[#39ff14]/20 to-cyan-500/20" : "bg-[#1a1a1a]"
                        }`}>
                          <span className="text-2xl">{isUnlocked ? "🏆" : "🔒"}</span>
                        </div>
                        <div>
                          <p className={`font-bold ${isUnlocked ? "text-white" : "text-gray-600"}`}>
                            {achievement.name}
                          </p>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-[#39ff14] border-[#39ff14]"
                          : "border-gray-600"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-black" />}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Save Button (Mobile) */}
        <div className="lg:hidden">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-[#39ff14] to-[#2de00f] text-black rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#39ff14]/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
