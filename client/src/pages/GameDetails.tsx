import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { players, rooms } from "@/data/mockData";
import PitchOverlay from "@/components/PitchOverlay";
import ProgressRing from "@/components/ProgressRing";

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
    { id: "1", user: "Sarah", text: "I can bring bibs." },
    { id: "2", user: "Marcus", text: "See you 15 mins before kickoff." },
  ]);

  const playersJoined = roster.length;
  const fillPct = Math.round((playersJoined / room.maxPlayers) * 100);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [{ id: String(prev.length + 1), user: "You", text: message }, ...prev]);
    setMessage("");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center gap-3">
          <Link href="/" className="btn-secondary relative z-10 !min-h-10 !px-3" aria-label="Back to games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="relative z-10">
            <h1 className="text-xl font-semibold text-[#f2f7f2]">{room.location}</h1>
            <p className="text-xs text-[#97a49b]">
              {room.date} · {room.time}
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card pitch-lines">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="surface-inner">
              <p className="text-[#8f9d93]">Address</p>
              <p className="mt-1 text-sm text-[#edf3ee]">{room.location}</p>
            </div>
            <div className="surface-inner">
              <p className="text-[#8f9d93]">Duration</p>
              <p className="mt-1 text-sm text-[#edf3ee]">60 minutes</p>
            </div>
            <div className="surface-inner">
              <p className="text-[#8f9d93]">Skill</p>
              <p className="mt-1 text-sm text-[#edf3ee]">{room.allowedBand ?? "Hybrid"}</p>
            </div>
            <div className="surface-inner">
              <p className="text-[#8f9d93]">Price</p>
              <p className="mt-1 text-sm text-[#edf3ee]">${room.price}/player</p>
            </div>
          </div>

          <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#98a69c]">
            <MapPin className="h-3.5 w-3.5" />
            {room.distanceKm.toFixed(1)} km away
          </p>
        </section>

        <section className="surface-card relative overflow-hidden">
          <PitchOverlay variant="card" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8f9d93]">Room Fill</p>
              <p className="mt-1 text-sm text-[#d9e5db]">
                {playersJoined}/{room.maxPlayers} players
              </p>
            </div>
            <ProgressRing size="lg" value={playersJoined / room.maxPlayers} label={`${fillPct}%`} />
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-sm font-semibold text-[#f2f7f2]">Players</h2>
          <div className="mt-3 space-y-2">
            {roster.map((player) => (
              <div key={player!.id} className="surface-inner flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#202720] text-xs font-semibold text-[#dce6de]">
                    {player!.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm text-[#edf3ee]">{player!.name}</p>
                    <p className="text-xs text-[#95a39a]">{player!.publicSkillBand}</p>
                  </div>
                </div>
                <span className="chip">{player!.reliabilityScore}%</span>
              </div>
            ))}
          </div>
        </section>

        {isJoined && (
          <section className="surface-card">
            <h2 className="text-sm font-semibold text-[#f2f7f2]">Room Chat</h2>
            <div className="mt-3 space-y-2">
              {chat.map((item) => (
                <div
                  key={item.id}
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-xs ${
                    item.user === "You" ? "ml-auto bg-[#9dff3f] text-[#0f160c]" : "bg-[#1a211b] text-[#d4ddd6]"
                  }`}
                >
                  <p className="font-semibold">{item.user}</p>
                  <p className="mt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message room" />
              <button onClick={sendMessage} className="btn-secondary !px-3">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        <button
          onClick={() => {
            if (isJoined && !window.confirm("Leave this room?")) return;
            setIsJoined((prev) => !prev);
            toast.success(isJoined ? "You left this room" : "Joined room successfully");
          }}
          className={isJoined ? "btn-destructive w-full" : "btn-primary w-full"}
        >
          {isJoined ? "Leave Game" : "Join Game"}
        </button>
      </main>

      <Navigation />
    </div>
  );
}
