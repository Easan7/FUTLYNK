import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PitchOverlay from "@/components/PitchOverlay";
import ProgressRing from "@/components/ProgressRing";
import { apiGet, apiPost, DEFAULT_USER_ID } from "@/lib/api";

type RoomDetailResponse = {
  room: {
    id: string;
    location: string;
    date: string;
    time: string;
    distanceKm: number;
    price: number;
    priceVisible?: boolean;
    maxPlayers: number;
    allowedBand: string | null;
  };
  roster: Array<{
    id: string;
    name: string;
    publicSkillBand: string;
    reliabilityScore: number;
  }>;
  chat: Array<{ id: string; user: string; text: string }>;
  isJoined: boolean;
};

type JoinResponse = {
  ok: boolean;
  joined: boolean;
  requiresPayment?: boolean;
  amount?: number;
  walletBalance?: number;
};

export default function GameDetails() {
  const [, params] = useRoute("/game/:id");
  const roomId = params?.id ?? "1";
  const [detail, setDetail] = useState<RoomDetailResponse | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<{ id: string; user: string; text: string }>>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [paymentPrompt, setPaymentPrompt] = useState<{ amount: number; walletBalance?: number } | null>(null);

  const loadDetail = async () => {
    try {
      const payload = await apiGet<RoomDetailResponse>(`/api/v1/rooms/${roomId}?user_id=${DEFAULT_USER_ID}`);
      setDetail(payload);
      setChat(payload.chat);
      setIsJoined(payload.isJoined);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to load room details";
      toast.error(msg);
    }
  };

  useEffect(() => {
    void loadDetail();
  }, [roomId]);

  const room = detail?.room;
  const roster = useMemo(() => detail?.roster ?? [], [detail?.roster]);
  const playersJoined = roster.length;
  const fillPct = room ? Math.round((playersJoined / room.maxPlayers) * 100) : 0;

  const sendMessage = async () => {
    if (!message.trim()) return;
    await apiPost(`/api/v1/rooms/${roomId}/chat`, { user_id: DEFAULT_USER_ID, text: message });
    setChat((prev) => [{ id: String(Date.now()), user: "You", text: message }, ...prev]);
    setMessage("");
  };

  if (!room) {
    return (
      <div className="app-shell">
        <FootballLoader fullScreen label="Loading room..." />
        <Navigation />
      </div>
    );
  }

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
              <p className="mt-1 text-sm text-[#edf3ee]">
                {room.priceVisible === false ? "Paid" : `$${room.price}/player`}
              </p>
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
              <div key={player.id} className="surface-inner flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#202720] text-xs font-semibold text-[#dce6de]">
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm text-[#edf3ee]">{player.name}</p>
                    <p className="text-xs text-[#95a39a]">{player.publicSkillBand}</p>
                  </div>
                </div>
                <span className="chip">{player.reliabilityScore}%</span>
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
          onClick={async () => {
            if (isJoined && !window.confirm("Leave this room?")) return;
            if (isJoined) {
              await apiPost(`/api/v1/rooms/${roomId}/leave`, { user_id: DEFAULT_USER_ID });
              setIsJoined(false);
              await loadDetail();
              toast.success("You left this room");
              return;
            }

            const firstAttempt = await apiPost<JoinResponse>(`/api/v1/rooms/${roomId}/join`, {
              user_id: DEFAULT_USER_ID,
              pay_when_required: false,
            });

            if (firstAttempt.requiresPayment) {
              const amount = Number(firstAttempt.amount ?? room.price).toFixed(2);
              setPaymentPrompt({
                amount: Number(amount),
                walletBalance: firstAttempt.walletBalance,
              });
              return;
            }

            setIsJoined(true);
            await loadDetail();
            toast.success("Joined room successfully");
          }}
          className={isJoined ? "btn-destructive w-full" : "btn-primary w-full"}
        >
          {isJoined ? "Leave Game" : "Join Game"}
        </button>
      </main>

      <Dialog open={Boolean(paymentPrompt)} onOpenChange={(open) => { if (!open) setPaymentPrompt(null); }}>
        <DialogContent className="border-[#2d372f] bg-[#0f1511]">
          <DialogHeader>
            <DialogTitle className="text-[#eef5ef]">Payment Required</DialogTitle>
            <DialogDescription className="text-[#9faea3]">
              This room is at or above 80% capacity. Confirm payment to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-[#304235] bg-[#172119] p-3">
              <p className="text-[#9fb0a4]">Join Fee</p>
              <p className="mt-1 text-lg font-semibold text-[#eef5ef]">${Number(paymentPrompt?.amount ?? 0).toFixed(2)}</p>
              {paymentPrompt?.walletBalance !== undefined ? (
                <p className="mt-1 text-[#9fb0a4]">Wallet: ${Number(paymentPrompt.walletBalance).toFixed(2)}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-secondary w-full text-sm" onClick={() => setPaymentPrompt(null)}>
                Cancel
              </button>
              <button
                className="btn-primary w-full text-sm"
                onClick={async () => {
                  try {
                    await apiPost<JoinResponse>(`/api/v1/rooms/${roomId}/join`, {
                      user_id: DEFAULT_USER_ID,
                      pay_when_required: true,
                    });
                    setPaymentPrompt(null);
                    setIsJoined(true);
                    await loadDetail();
                    toast.success("Joined room successfully");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Unable to complete payment");
                  }
                }}
              >
                Pay & Join
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}
