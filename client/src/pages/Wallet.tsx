import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Wallet as WalletIcon } from "lucide-react";
import Navigation from "@/components/Navigation";

const initialActivity = [
  { id: "a1", text: "Top up", amount: "+$20.00", time: "Mar 20" },
  { id: "a2", text: "Game fee", amount: "-$15.00", time: "Mar 18" },
  { id: "a3", text: "Game fee", amount: "-$18.00", time: "Mar 16" },
];

export default function Wallet() {
  const [walletBalance, setWalletBalance] = useState(125.5);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <button className="btn-secondary !px-3">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Wallet</h1>
            <p className="text-xs text-[#95a39a]">Manage balance and recent activity</p>
          </div>
        </div>
      </header>

      <main className="space-y-3 p-4">
        <section className="surface-card pitch-lines">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#f2f7f2]">
            <WalletIcon className="h-4 w-4 text-[#9dff3f]" /> Current Balance
          </h2>
          <p className="mt-2 text-3xl font-semibold text-[#f2f7f2]">${walletBalance.toFixed(2)}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[10, 20, 50].map((amount) => (
              <button key={amount} onClick={() => setWalletBalance((prev) => prev + amount)} className="btn-primary !px-2 text-xs">
                +${amount}
              </button>
            ))}
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
