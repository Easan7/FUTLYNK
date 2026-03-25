import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Gift, Ticket, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";
import { loadPlayerProgress, redeemVoucher } from "@/lib/playerProgress";

const initialActivity = [
  { id: "a1", text: "Top up", amount: "+$20.00", time: "Mar 20" },
  { id: "a2", text: "Game fee", amount: "-$15.00", time: "Mar 18" },
  { id: "a3", text: "Game fee", amount: "-$18.00", time: "Mar 16" },
];

const vouchers = [
  { id: "v1", title: "$5 Court Credit", cost: 120, code: "FUT5-COURT", detail: "Use on next booking" },
  { id: "v2", title: "Free Water Pack", cost: 90, code: "HYDRATE-90", detail: "Redeem at partner venue" },
  { id: "v3", title: "10% Gear Discount", cost: 180, code: "FUTGEAR10", detail: "Sports store partner" },
];

export default function Wallet() {
  const [walletBalance, setWalletBalance] = useState(125.5);
  const [progress, setProgress] = useState(loadPlayerProgress());

  const handleRedeem = (voucherId: string, cost: number, code: string) => {
    const result = redeemVoucher(voucherId, cost);
    if (!result.ok) {
      if (result.reason === "already-redeemed") {
        toast.info("Voucher already redeemed");
      } else {
        toast.error("Not enough points yet");
      }
      return;
    }

    setProgress(result.progress);
    toast.success("Voucher redeemed", {
      description: `Code: ${code}`,
    });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <button className="btn-secondary relative z-10 !px-3">
              <ArrowLeft className="h-4 w-4" />
            </button>
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
            <StatBlock label="FutPoints" value={progress.points} subValue="Earned from played games" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[10, 20, 50].map((amount) => (
              <button key={amount} onClick={() => setWalletBalance((prev) => prev + amount)} className="btn-primary !px-2 text-xs">
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
              const isRedeemed = progress.redeemedVoucherIds.includes(voucher.id);
              const canRedeem = progress.points >= voucher.cost && !isRedeemed;

              return (
                <div key={voucher.id} className="surface-inner">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#edf3ee]">{voucher.title}</p>
                      <p className="mt-0.5 text-xs text-[#95a39a]">{voucher.detail}</p>
                      <p className="mt-1 text-xs text-[#b7c5ba]">{voucher.cost} points</p>
                    </div>
                    <button
                      onClick={() => handleRedeem(voucher.id, voucher.cost, voucher.code)}
                      disabled={!canRedeem}
                      className={canRedeem ? "btn-primary text-xs" : "btn-secondary text-xs"}
                    >
                      {isRedeemed ? "Redeemed" : "Redeem"}
                    </button>
                  </div>
                  {isRedeemed && (
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
            {initialActivity.map((item) => (
              <div key={item.id} className="surface-inner flex items-center justify-between text-xs">
                <div>
                  <p className="text-[#e4ece6]">{item.text}</p>
                  <p className="text-[#8f9d93]">{item.time}</p>
                </div>
                <span className={item.amount.startsWith("+") ? "text-[#9dff3f]" : "text-[#cbd5cd]"}>{item.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
