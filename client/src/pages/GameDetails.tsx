import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, CalendarClock, MapPin, Send, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import SkillBadge from "@/components/SkillBadge";
import { currentUser, players, rooms } from "@/data/mockData";

const mockRosterByRoom: Record<string, string[]> = {
  "1": ["u-me", "u-2", "u-6", "u-4", "u-1", "u-3", "u-7", "u-5"],
  "2": ["u-me", "u-1", "u-2", "u-7", "u-3", "u-4"],
  "3": ["u-me", "u-2", "u-4", "u-6", "u-5"],
  "4": ["u-1", "u-3", "u-6", "u-2", "u-4", "u-7", "u-5", "u-me", "u-2"],
  "5": ["u-me", "u-7", "u-5", "u-2"],
};

export default function GameDetails() {
  const [, params] = useRoute("/game/:id");
  const roomId = params?.id ?? "1";
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];

  const roster = useMemo(() => {
    const ids = mockRosterByRoom[room.id] ?? ["u-me", "u-2", "u-4"];
    return ids.map((id) => players.find((p) => p.id === id)).filter(Boolean);
  }, [room.id]);

  const [isJoined, setIsJoined] = useState(room.playersJoined >= 6);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { id: "1", user: "Sarah", text: "I can bring bibs.", time: "1h ago" },
    { id: "2", user: "Marcus", text: "Let's keep it high tempo.", time: "38m ago" },
  ]);

  const playersJoined = roster.length;
  const fillPct = Math.round((playersJoined / room.maxPlayers) * 100);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [{ id: String(prev.length + 1), user: "You", text: message, time: "now" }, ...prev]);
    setMessage("");
    toast.success("Message sent");
  };

  return (
    <div className="min-h-screen bg-[#0b0f18] pb-24">
      <header className="border-b border-white/10 px-4 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="rounded-xl border border-[#2a3448] bg-[#101624] p-2 text-[#c6d3e6]">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">{room.title}</h1>
            <p className="text-xs text-[#94a6c3]">{room.date} · {room.time}</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4">
        <section className="surface-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{room.location}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[#9fb1cd]">
                <MapPin className="h-3.5 w-3.5" /> {room.distanceKm.toFixed(1)} km away
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[#9fb1cd]">
                <CalendarClock className="h-3.5 w-3.5" /> ${room.price}/player · released by FutLynk
              </p>
            </div>
            {room.allowedBand === null ? <SkillBadge level="Hybrid" colored /> : <SkillBadge level={room.allowedBand} colored />}
          </div>

          <div className="mt-3 rounded-2xl bg-[#101624] p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-[#9fb1cd]">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {playersJoined}/{room.maxPlayers} players
              </span>
              <span>{fillPct}% filled</span>
            </div>
            <div className="h-2 rounded-full bg-[#1f2a3e]">
              <div className="h-full rounded-full bg-[#a8ff3f]" style={{ width: `${fillPct}%` }} />
            </div>
          </div>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-semibold text-white">Roster</h2>
          <div className="mt-3 space-y-2">
            {roster.map((player) => (
              <div key={player!.id} className="flex items-center justify-between rounded-2xl bg-[#101624] p-2.5">
                <div>
                  <p className="text-sm text-white">{player!.name}</p>
                  <p className="text-xs text-[#98abc7]">{player!.tags.slice(0, 2).join(" · ")}</p>
                </div>
                <SkillBadge level={player!.publicSkillBand} colored />
              </div>
            ))}
          </div>
        </section>

        {isJoined && (
          <section className="surface-card p-4">
            <h2 className="text-sm font-semibold text-white">Room chat</h2>
            <div className="mt-3 space-y-2">
              {chat.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[#101624] p-2.5 text-xs text-[#c4d0e3]">
                  <span className="font-semibold text-white">{item.user}:</span> {item.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message room"
                className="border-[#2f3a51] bg-[#0f1624] text-white"
              />
              <button onClick={sendMessage} className="rounded-xl bg-[#1a2538] px-3 text-[#dce5f3]">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        <button
          onClick={() => {
            setIsJoined((prev) => !prev);
            toast.success(isJoined ? "You left this room" : "Joined room successfully");
          }}
          className={`w-full rounded-2xl py-3 text-sm font-semibold ${
            isJoined ? "border border-[#3a4863] bg-[#121a29] text-[#d3dfee]" : "bg-[#a8ff3f] text-[#11190f]"
          }`}
        >
          {isJoined ? "Leave room" : "Join room"}
        </button>
      </main>

      <Navigation />
    </div>
  );
}
