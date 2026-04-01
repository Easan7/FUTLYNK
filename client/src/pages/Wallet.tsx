import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Gift, QrCode, ShieldCheck, Ticket, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiGet, apiPost, getCurrentUserId } from "@/lib/api";

type WalletData = {
  walletBalance: number;
  points: number;
  vouchers: Array<{ id: string; title: string; cost: number; code: string; detail: string; isRedeemed: boolean }>;
  activity: Array<{ id: string; text: string; amount: string; time: string }>;
};

export default function Wallet() {
  const currentUserId = getCurrentUserId();
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [topupDialogOpen, setTopupDialogOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState<"paynow" | "card">("paynow");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const payload = await apiGet<WalletData>(`/api/v1/wallet?user_id=${currentUserId}`);
      setData(payload);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleTopup = async (amount: number) => {
    await apiPost("/api/v1/wallet/topup", { user_id: currentUserId, amount });
    toast.success(`Added $${amount}`);
    await load();
  };

  const openTopupDialog = (amount: number) => {
    setTopupAmount(amount);
    setTopupDialogOpen(true);
  };

  const runMockPayment = async () => {
    if (topupAmount <= 0 || isProcessingPayment) return;
    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s+/g, "");
      if (digits.length < 12 || !cardExpiry.trim() || cardCvc.trim().length < 3) {
        toast.error("Enter valid card details");
        return;
      }
    }
    setIsProcessingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await handleTopup(topupAmount);
    setIsProcessingPayment(false);
    setTopupDialogOpen(false);
  };

  const handleRedeem = async (voucherId: string, code: string) => {
    const result = await apiPost<{ ok: boolean; reason?: string }>("/api/v1/wallet/redeem", {
      user_id: currentUserId,
      voucher_id: voucherId,
    });

    if (!result.ok) {
      if (result.reason === "already-redeemed") {
        toast.info("Voucher already redeemed");
      } else {
        toast.error("Not enough points yet");
      }
      return;
    }

    toast.success("Voucher redeemed", {
      description: `Code: ${code}`,
    });

    await load();
  };

  const walletBalance = data?.walletBalance ?? 0;
  const points = data?.points ?? 0;
  const vouchers = data?.vouchers ?? [];
  const activity = data?.activity ?? [];

  if (loading && !data) {
    return (
      <div className="app-shell">
        <FootballLoader fullScreen label="Loading wallet..." />
        <Navigation />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center gap-3">
          <Link href="/profile" className="btn-secondary relative z-10 !min-h-10 !px-3" aria-label="Back to profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="relative z-10">
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Wallet & Rewards</h1>
            <p className="text-xs text-[#95a39a]">Balance, points, and voucher redemption</p>
          </div>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card pitch-lines">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <WalletIcon className="h-4 w-4 text-[#9dff3f]" /> Wallet Balance
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <StatBlock label="Available" value={`$${walletBalance.toFixed(2)}`} />
            <StatBlock label="FutPoints" value={points} subValue="Earned from played games" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[10, 20, 50].map((amount) => (
              <button key={amount} onClick={() => openTopupDialog(amount)} className="btn-primary !px-2 text-xs">
                +${amount}
              </button>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <Gift className="h-4 w-4 text-[#9dff3f]" /> Redeem Vouchers
          </h3>
          <div className="mt-3 space-y-2">
            {vouchers.map((voucher) => {
              const canRedeem = points >= voucher.cost && !voucher.isRedeemed;

              return (
                <div key={voucher.id} className="surface-inner">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#edf3ee]">{voucher.title}</p>
                      <p className="mt-0.5 text-xs text-[#95a39a]">{voucher.detail}</p>
                      <p className="mt-1 text-xs text-[#b7c5ba]">{voucher.cost} points</p>
                    </div>
                    <button
                      onClick={() => void handleRedeem(voucher.id, voucher.code)}
                      disabled={!canRedeem}
                      className={canRedeem ? "btn-primary text-xs" : "btn-secondary text-xs"}
                    >
                      {voucher.isRedeemed ? "Redeemed" : "Redeem"}
                    </button>
                  </div>
                  {voucher.isRedeemed && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#334132] bg-[#1a2219] px-2 py-1 text-[11px] text-[#cfe0d1]">
                      <Ticket className="h-3 w-3 text-[#9dff3f]" /> {voucher.code}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="surface-card">
          <h3 className="text-sm font-semibold text-[#f2f7f2]">Recent Activity</h3>
          <div className="mt-3 space-y-2">
            {activity.map((item) => (
              <div key={item.id} className="surface-inner flex items-center justify-between text-xs">
                <div>
                  <p className="text-[#e4ece6]">{item.text}</p>
                  <p className="text-[#8f9d93]">{item.time}</p>
                </div>
                <span className={item.amount.startsWith("+") ? "text-[#9dff3f]" : "text-[#cbd5cd]"}>${item.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={topupDialogOpen} onOpenChange={(open) => !isProcessingPayment && setTopupDialogOpen(open)}>
        <DialogContent className="border-[#2d372f] bg-[#0f1511]">
          <DialogHeader>
            <DialogTitle className="text-[#eef5ef]">Add Funds</DialogTitle>
            <DialogDescription className="text-[#9faea3]">
              Complete your top-up using PayNow or Card payment (mocked for MVP demo).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#2f3a31] bg-[#141b16] p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-[#8ea194]">Amount</p>
              <Input
                type="number"
                min={1}
                step={1}
                value={topupAmount}
                onChange={(e) => setTopupAmount(Math.max(1, Number(e.target.value) || 1))}
                className="mt-2 h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod("paynow")}
                className={`rounded-xl border px-3 py-2 text-left ${paymentMethod === "paynow" ? "border-[#5e8b2c] bg-[#1f3117]" : "border-[#2f3a31] bg-[#141b16]"}`}
              >
                <p className="text-sm font-semibold text-[#eef5ef]">PayNow</p>
                <p className="mt-1 text-xs text-[#9aa99f]">Instant transfer</p>
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`rounded-xl border px-3 py-2 text-left ${paymentMethod === "card" ? "border-[#5e8b2c] bg-[#1f3117]" : "border-[#2f3a31] bg-[#141b16]"}`}
              >
                <p className="text-sm font-semibold text-[#eef5ef]">Card</p>
                <p className="mt-1 text-xs text-[#9aa99f]">Visa / Mastercard</p>
              </button>
            </div>

            {paymentMethod === "paynow" ? (
              <div className="rounded-xl border border-[#2f3a31] bg-[#141b16] p-3">
                <div className="flex items-center gap-2 text-[#d7e5d9]">
                  <QrCode className="h-4 w-4 text-[#9dff3f]" />
                  <p className="text-sm font-semibold">Scan to Pay (Mock)</p>
                </div>
                <div className="mt-3 grid place-items-center rounded-lg border border-dashed border-[#415146] bg-[#101712] p-6">
                  <div className="grid h-24 w-24 place-items-center rounded-md border border-[#3d4d42] bg-[#17211a]">
                    <QrCode className="h-10 w-10 text-[#9dff3f]" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#9aa99f]">UEN: T24FUTLYNKMVP · Reference: WALLET TOPUP</p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#2f3a31] bg-[#141b16] p-3">
                <p className="text-sm font-semibold text-[#eef5ef]">Card Details</p>
                <div className="mt-2 space-y-2">
                  <Input placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                    <Input placeholder="CVC" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#2f3a31] bg-[#141b16] px-3 py-2">
              <p className="text-sm text-[#dce8de]">Total to add: <span className="font-semibold text-[#9dff3f]">${topupAmount.toFixed(2)}</span></p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#98a79d]">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout UI (mocked)
              </p>
            </div>

            <button onClick={() => void runMockPayment()} disabled={isProcessingPayment} className="btn-primary w-full">
              {isProcessingPayment ? "Processing Payment..." : `Pay $${topupAmount.toFixed(2)}`}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}
