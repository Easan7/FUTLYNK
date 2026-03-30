import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Gift, Ticket, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FootballLoader from "@/components/FootballLoader";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import { apiGet, apiPost, DEFAULT_USER_ID } from "@/lib/api";

type WalletData = {
  walletBalance: number;
  points: number;
  vouchers: Array<{ id: string; title: string; cost: number; code: string; detail: string; isRedeemed: boolean }>;
  activity: Array<{ id: string; text: string; amount: string; time: string }>;
};

export default function Wallet() {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const payload = await apiGet<WalletData>(`/api/v1/wallet?user_id=${DEFAULT_USER_ID}`);
      setData(payload);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleTopup = async (amount: number) => {
    await apiPost("/api/v1/wallet/topup", { user_id: DEFAULT_USER_ID, amount });
    toast.success(`Added $${amount}`);
    await load();
  };

  const handleRedeem = async (voucherId: string, code: string) => {
    const result = await apiPost<{ ok: boolean; reason?: string }>("/api/v1/wallet/redeem", {
      user_id: DEFAULT_USER_ID,
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
              <button key={amount} onClick={() => void handleTopup(amount)} className="btn-primary !px-2 text-xs">
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

      <Navigation />
    </div>
  );
}
