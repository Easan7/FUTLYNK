import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Gift, Ticket, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import { Input } from "@/components/ui/input";
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
  const [topupAmount, setTopupAmount] = useState(20);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasConfirmedStripeTopup, setHasConfirmedStripeTopup] = useState(false);
  const [hasHandledStripeReturn, setHasHandledStripeReturn] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topupState = params.get("topup");
    const sessionId = params.get("session_id");
    if (hasHandledStripeReturn) return;

    if (topupState === "cancel") {
      toast.info("Top-up cancelled");
      setHasHandledStripeReturn(true);
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (topupState !== "success" || !sessionId || hasConfirmedStripeTopup) return;

    const confirm = async () => {
      try {
        const result = await apiPost<{ ok: boolean; paid?: boolean; alreadyProcessed?: boolean; amount?: number }>(
          "/api/v1/wallet/topup/confirm",
          { user_id: currentUserId, session_id: sessionId }
        );
        if (result.ok && (result.paid || result.alreadyProcessed)) {
          toast.success(result.alreadyProcessed ? "Top-up already applied" : `Top-up successful (+$${(result.amount ?? 0).toFixed(2)})`);
          await load();
        } else {
          toast.info("Payment not completed yet");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not confirm Stripe payment");
      } finally {
        setHasConfirmedStripeTopup(true);
        setHasHandledStripeReturn(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    };
    void confirm();
  }, [currentUserId, hasConfirmedStripeTopup, hasHandledStripeReturn]);

  const startStripeCheckout = async (amount: number) => {
    setTopupAmount(amount);
    if (amount <= 0 || isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      const session = await apiPost<{ checkoutUrl?: string }>("/api/v1/wallet/topup/checkout", {
        user_id: currentUserId,
        amount,
      });
      if (!session.checkoutUrl) {
        throw new Error("Stripe checkout URL missing");
      }
      window.location.href = session.checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start Stripe checkout");
      setIsProcessingPayment(false);
    }
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
              <button
                key={amount}
                onClick={() => void startStripeCheckout(amount)}
                className="btn-primary !px-2 text-xs"
                disabled={isProcessingPayment}
              >
                +${amount}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              type="number"
              min={1}
              step={1}
              value={topupAmount}
              onChange={(e) => setTopupAmount(Math.max(1, Number(e.target.value) || 1))}
              className="h-10"
            />
            <button
              onClick={() => void startStripeCheckout(topupAmount)}
              className="btn-secondary text-xs"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Redirecting..." : "Top Up via Stripe"}
            </button>
          </div>
          <p className="mt-2 text-xs text-[#95a39a]">Top-up redirects to Stripe Checkout (test mode).</p>
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

      <Navigation />
    </div>
  );
}
