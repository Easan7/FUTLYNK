import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, CalendarClock, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { players, rooms } from "@/data/mockData";

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
  const remaining = Math.max(room.maxPlayers - playersJoined, 0);

  const toRole = (tags: string[]) => {
    const knownRoles = ["Forward", "Defender", "Midfielder", "Goalkeeper", "Winger"];
    return tags.find((tag) => knownRoles.includes(tag)) ?? "Player";
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [{ id: String(prev.length + 1), user: "You", text: message, time: "now" }, ...prev]);
    setMessage("");
    toast.success("Message sent");
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] pb-24">
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
        <section className="rounded-2xl border border-[#273247] bg-[#121824] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.22)]">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[#2a354b] bg-[#171f2d] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[#8f9fb7]">Address</p>
              <p className="mt-1 text-sm text-white">{room.location}</p>
            </div>
            <div className="rounded-xl border border-[#2a354b] bg-[#171f2d] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[#8f9fb7]">Duration</p>
              <p className="mt-1 text-sm text-white">60 min</p>
            </div>
            <div className="rounded-xl border border-[#2a354b] bg-[#171f2d] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[#8f9fb7]">Price</p>
              <p className="mt-1 text-sm text-white">${room.price}/player</p>
            </div>
            <div className="rounded-xl border border-[#2a354b] bg-[#171f2d] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[#8f9fb7]">Format</p>
              <span className="mt-1 inline-flex rounded-full border border-[#3a4962] bg-[#1b2535] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#d8e2f0]">
                {room.allowedBand ?? "Hybrid"}
              </span>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs text-[#9fb1cd]">
            <MapPin className="h-3.5 w-3.5" /> {room.distanceKm.toFixed(1)} km away
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#9fb1cd]">
            <CalendarClock className="h-3.5 w-3.5" /> {room.date} · {room.time}
          </p>
        </section>

        <section className="rounded-2xl border border-[#273247] bg-[#121824] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-white">Squad</h2>
          <p className="mt-2 text-3xl font-semibold text-white">
            {String(playersJoined).padStart(2, "0")} / {String(room.maxPlayers).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-[#9ba9c0]">
            {remaining > 0 ? `${remaining} more to confirm` : "Squad confirmed"}
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-[#243046]">
            <div className="h-full rounded-full bg-[#8ad94f]" style={{ width: `${fillPct}%` }} />
          </div>
        </section>

        <section className="rounded-2xl border border-[#273247] bg-[#121824] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-white">Players</h2>
          <div className="mt-3 space-y-2">
            {roster.map((player) => {
              const role = toRole(player!.tags);
              const metaTags = player!.tags.filter((tag) => tag !== role).slice(0, 2);

              return (
                <div key={player!.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#243248] bg-[#171f2d] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#24324a] text-xs font-semibold text-[#d9e5f3]">
                      {player!.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{player!.name}</p>
                      <p className="text-xs text-[#9aacbf]">{role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {metaTags.map((tag) => (
                      <span
                        key={`${player!.id}-${tag}`}
                        className="rounded-full border border-[#3a4962] bg-[#1c2738] px-2 py-0.5 text-[10px] text-[#cad6e6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {isJoined && (
          <section className="rounded-2xl border border-[#273247] bg-[#121824] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.22)]">
            <h2 className="text-sm font-semibold text-white">Room chat</h2>
            <div className="mt-3 space-y-2">
              {chat.map((item) => (
                <div
                  key={item.id}
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs ${
                    item.user === "You"
                      ? "ml-auto bg-[#8ad94f] text-[#10170c]"
                      : "bg-[#1b2536] text-[#ced9e8]"
                  }`}
                >
                  <p className="font-semibold">{item.user}</p>
                  <p className="mt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message room"
                className="h-10 border-[#2f3a51] bg-[#0f1624] text-white"
              />
              <button onClick={sendMessage} className="rounded-xl border border-[#33415a] bg-[#1a2334] px-3 text-[#dce5f3]">
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
          className={`w-full rounded-xl py-3 text-sm font-semibold ${
            isJoined ? "border border-[#3a4863] bg-[#182236] text-[#d3dfee]" : "bg-[#8ad94f] text-[#11190f]"
          }`}
        >
          {isJoined ? "Leave Game" : "Join Game"}
        </button>
      </main>

      <Navigation />
    </div>
  );
}
