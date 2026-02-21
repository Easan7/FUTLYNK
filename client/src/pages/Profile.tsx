/**
 * Profile Page - Unique Design
 * Large numbers, minimal cards, clean achievement badges
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SkillBadge from "@/components/SkillBadge";
import wallpaperImage from "@/assets/images/wallpaper.jpg";
import backgroundImage from "@/assets/images/background.jpg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Award,
  CheckCircle2,
  Users,
  Shield,
  Zap,
  Target,
  Clock,
  UserPlus,
  X,
  Calendar,
  CalendarDays,
  Bell,
  Wallet,
  Edit3,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockProfile = {
  name: "Alex Chen",
  skillLevel: "Intermediate" as const,
  matchesPlayed: 47,
  attendanceRate: 95,
  tags: [
    { id: "1", name: "Reliable", icon: Shield },
    { id: "2", name: "Team Player", icon: Users },
    { id: "3", name: "Forward", icon: Zap },
    { id: "4", name: "Punctual", icon: Clock },
  ],
  achievements: [
    { id: "1", name: "10 Games", icon: Trophy, unlocked: true },
    { id: "2", name: "Perfect Attendance", icon: CheckCircle2, unlocked: true },
    { id: "3", name: "50 Games", icon: Award, unlocked: false },
    { id: "4", name: "Team Captain", icon: Target, unlocked: false },
  ],
  matchHistory: [
    { id: "1", date: "Feb 10, 2026", venue: "Downtown Arena", players: 10 },
    { id: "2", date: "Feb 8, 2026", venue: "Eastside Court", players: 10 },
    { id: "3", date: "Feb 5, 2026", venue: "Metro Complex", players: 8 },
    { id: "4", date: "Feb 3, 2026", venue: "Westgate Sports", players: 10 },
    { id: "5", date: "Jan 30, 2026", venue: "Riverside Hub", players: 10 },
    { id: "6", date: "Jan 27, 2026", venue: "Downtown Arena", players: 10 },
  ],
};

const mockFriends = [
  { id: "1", name: "Marcus Chen", skillLevel: "Advanced" as const },
  { id: "2", name: "Sarah Williams", skillLevel: "Intermediate" as const },
  { id: "3", name: "Diego Martinez", skillLevel: "Advanced" as const },
  { id: "4", name: "Aisha Patel", skillLevel: "Intermediate" as const },
];

export default function Profile() {
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [walletBalance, setWalletBalance] = useState(125.50);
  const [showWallet, setShowWallet] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(mockProfile.name);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [availabilityMode, setAvailabilityMode] = useState<"recurring" | "specific">("recurring");
  const [recurringSlots, setRecurringSlots] = useState<Record<string, boolean[]>>({
    Mon: Array(24).fill(false),
    Tue: Array(24).fill(false),
    Wed: Array(24).fill(false),
    Thu: Array(24).fill(false),
    Fri: Array(24).fill(false),
    Sat: Array(24).fill(false),
    Sun: Array(24).fill(false),
  });
  const [specificDates, setSpecificDates] = useState<Array<{date: string, time: string}>>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("19:00");

  const handleAddFriend = (name: string) => {
    toast.success(`Friend request sent to ${name}!`);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Futsal abstract"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#050505]/78" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="bg-[#0a0a0a]/70 border-b border-[#1a1a1a] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWallet(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#222222] transition-colors"
              >
                <Wallet className="w-4 h-4 text-[#39ff14]" />
                <span className="text-white font-bold text-sm">${walletBalance.toFixed(2)}</span>
              </button>
              <Link href="/notifications">
                <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Bell className="w-6 h-6 text-white" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#39ff14] rounded-full" />
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 space-y-6">
          {/* Profile Header - Centered, minimal */}
          <section className="flex flex-col items-center py-6 space-y-4">
            <Avatar className="w-24 h-24 border-2 border-[#2a2a2a]">
              <AvatarFallback className="bg-[#1a1a1a] text-white text-3xl font-bold">
                AC
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <h2 className="text-2xl font-bold text-white">{editName}</h2>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <SkillBadge level={mockProfile.skillLevel} />

              {/* Friends Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setShowFriends(true);
                    setShowAddFriends(false);
                  }}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#222222] transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Friends
                </button>
                <button
                  onClick={() => {
                    setShowAddFriends(true);
                    setShowFriends(false);
                  }}
                  className="px-4 py-2 bg-[#39ff14] text-black rounded-lg hover:bg-[#2de00f] transition-colors flex items-center gap-2 font-bold"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Friends
                </button>
              </div>
            </div>
          </section>

          {/* Stats - Large numbers (WHOOP style) */}
          <section className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-white mb-1">{mockProfile.matchesPlayed}</p>
              <p className="text-[10px] uppercase text-gray-500 tracking-wide">Matches Played</p>
            </div>

            <div className="text-center">
              <p className="text-6xl font-bold text-[#39ff14] mb-1">{mockProfile.attendanceRate}%</p>
              <p className="text-[10px] uppercase text-gray-500 tracking-wide">Attendance</p>
            </div>
          </section>

          {/* Player Tags - Outlined pills */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Player Tags</h3>

            <div className="flex flex-wrap gap-2">
              {mockProfile.tags.map((tag) => {
                const Icon = tag.icon;
                return (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-700 rounded-full hover:border-gray-600 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{tag.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Achievements - Simple grid */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Achievements</h3>

            <div className="grid grid-cols-4 gap-3">
              {mockProfile.achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all ${
                        achievement.unlocked
                          ? "bg-[#1a1a1a] border-[#39ff14]"
                          : "bg-[#0a0a0a] border-gray-800 opacity-40"
                      }`}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          achievement.unlocked ? "text-[#39ff14]" : "text-gray-700"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[10px] text-center ${
                        achievement.unlocked ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {achievement.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Availability Settings */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Availability</h3>

            {/* Toggle between Recurring and Specific */}
            <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded-lg">
              <button
                onClick={() => setAvailabilityMode("recurring")}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                  availabilityMode === "recurring"
                    ? "bg-[#39ff14] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <CalendarDays className="w-4 h-4 inline mr-2" />
                Recurring
              </button>
              <button
                onClick={() => setAvailabilityMode("specific")}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                  availabilityMode === "specific"
                    ? "bg-[#39ff14] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Specific Dates
              </button>
            </div>

            {/* Recurring Availability Grid */}
            {availabilityMode === "recurring" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Select your typical weekly availability (7:00-23:00)</p>
                <div className="overflow-x-auto">
                  <div className="space-y-1">
                    {/* Time header */}
                    <div className="flex gap-1 pl-12">
                      {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour) => (
                        <div key={hour} className="w-8 text-center text-[9px] text-gray-500">
                          {hour}
                        </div>
                      ))}
                    </div>
                    {/* Day rows */}
                    {Object.entries(recurringSlots).map(([day, slots]) => (
                      <div key={day} className="flex gap-1 items-center">
                        <div className="w-10 text-xs text-gray-400 font-medium">{day}</div>
                        {slots.slice(7, 24).map((isSelected, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const newSlots = { ...recurringSlots };
                              newSlots[day][7 + idx] = !isSelected;
                              setRecurringSlots(newSlots);
                              toast.success(`${day} ${7 + idx}:00 ${isSelected ? 'removed' : 'added'}`);
                            }}
                            className={`w-8 h-8 rounded border transition-all ${
                              isSelected
                                ? "bg-[#39ff14] border-[#39ff14]"
                                : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Specific Dates Picker */}
            {availabilityMode === "specific" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Add specific dates and times when you're available</p>
                
                {!showDatePicker && (
                  <button
                    onClick={() => setShowDatePicker(true)}
                    className="w-full py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Add Date
                  </button>
                )}

                {/* Date/Time Picker */}
                {showDatePicker && (
                  <div className="p-4 bg-[#1a1a1a] rounded-lg space-y-3 border border-[#2a2a2a]">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Date</label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Time</label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (selectedDate) {
                            setSpecificDates([...specificDates, { date: selectedDate, time: selectedTime }]);
                            toast.success(`Added ${selectedDate} at ${selectedTime}`);
                            setSelectedDate("");
                            setSelectedTime("19:00");
                            setShowDatePicker(false);
                          } else {
                            toast.error("Please select a date");
                          }
                        }}
                        className="flex-1 py-2 bg-[#39ff14] text-black rounded-lg hover:bg-[#2de00f] transition-colors font-bold"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowDatePicker(false);
                          setSelectedDate("");
                          setSelectedTime("19:00");
                        }}
                        className="flex-1 py-2 bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {specificDates.length > 0 && (
                  <div className="space-y-2">
                    {specificDates.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border-l-2 border-[#39ff14]"
                      >
                        <div>
                          <p className="text-white text-sm font-medium">{item.date}</p>
                          <p className="text-gray-400 text-xs">{item.time}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSpecificDates(specificDates.filter((_, i) => i !== idx));
                            toast.success(`Date removed`);
                          }}
                          className="p-1 hover:bg-[#222222] rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Match History - Minimal list */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Match History</h3>

            <div className="space-y-2">
              {mockProfile.matchHistory.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222222] transition-colors border-l-2 border-[#39ff14]"
                >
                  <div>
                    <p className="text-white font-medium text-sm">{match.venue}</p>
                    <p className="text-gray-500 text-xs">{match.date}</p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{match.players}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Navigation />
      </div>

      {/* Friends Modal */}
      {showFriends && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#0a0a0a] rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Friends ({mockFriends.length})</h2>
              <button
                onClick={() => setShowFriends(false)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {mockFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                    <AvatarFallback className="bg-[#0f0f0f] text-white text-sm">
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{friend.name}</p>
                    <SkillBadge level={friend.skillLevel} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#0a0a0a] rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Wallet</h2>
              <button
                onClick={() => setShowWallet(false)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Balance Display */}
              <div className="bg-gradient-to-br from-[#39ff14]/20 to-cyan-500/20 border border-[#39ff14]/50 p-6 rounded-lg text-center space-y-2">
                <p className="text-gray-400 text-sm uppercase tracking-wide">Current Balance</p>
                <p className="text-5xl font-bold text-white">${walletBalance.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Available for game payments</p>
              </div>

              {/* Top Up Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Top Up Balance</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 25, 50, 100, 200, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setWalletBalance(prev => prev + amount);
                        toast.success(`Added $${amount} to wallet!`);
                      }}
                      className="py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#222222] hover:border-[#39ff14] transition-all font-bold"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Custom Amount</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    />
                    <button
                      onClick={() => {
                        const amount = parseFloat(topUpAmount);
                        if (amount > 0) {
                          setWalletBalance(prev => prev + amount);
                          toast.success(`Added $${amount.toFixed(2)} to wallet!`);
                          setTopUpAmount("");
                        }
                      }}
                      className="px-6 py-2 bg-[#39ff14] text-black rounded-lg font-bold hover:bg-[#2de00f] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Recent Transactions</h3>
                <div className="space-y-2">
                  {[
                    { id: 1, type: "payment", amount: -15, desc: "Downtown Sports Arena", date: "Feb 15" },
                    { id: 2, type: "topup", amount: 50, desc: "Wallet Top-up", date: "Feb 12" },
                    { id: 3, type: "payment", amount: -18, desc: "Metro Futsal Complex", date: "Feb 10" },
                  ].map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{txn.desc}</p>
                        <p className="text-gray-500 text-xs">{txn.date}</p>
                      </div>
                      <p className={`font-bold ${txn.amount > 0 ? 'text-[#39ff14]' : 'text-white'}`}>
                        {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#0a0a0a] rounded-t-2xl">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Display Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>

              <button
                onClick={() => {
                  toast.success("Profile updated!");
                  setShowEditProfile(false);
                }}
                className="w-full py-3 bg-[#39ff14] text-black rounded-lg font-bold hover:bg-[#2de00f] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Friends Modal */}
      {showAddFriends && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#0a0a0a] rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Friends</h2>
              <button
                onClick={() => setShowAddFriends(false)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or username..."
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />

              <div className="space-y-2">
                {["Jamie Wilson", "Chris Taylor", "Pat Anderson"].map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg"
                  >
                    <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                      <AvatarFallback className="bg-[#0f0f0f] text-white text-sm">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{name}</p>
                    </div>
                    <button
                      onClick={() => handleAddFriend(name)}
                      className="px-3 py-1 bg-[#39ff14] text-black rounded font-bold text-sm hover:bg-[#2de00f] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
