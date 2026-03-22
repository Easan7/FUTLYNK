import { ArrowRight, Sparkles } from "lucide-react";
import LoginEntryScene from "@/components/LoginEntryScene";

interface LoginProps {
  onEnter: () => void;
}

export default function Login({ onEnter }: LoginProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04070c]">
      <LoginEntryScene />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,10,0.3)_0%,rgba(3,6,10,0.5)_45%,rgba(3,6,10,0.9)_100%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-sm pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c5d4ea]">FutLynk tactical entry</p>
        </div>

        <div className="flex flex-1 items-end py-5 sm:items-center">
          <div className="mx-auto w-full max-w-sm rounded-3xl border border-[#2d3a52] bg-[#0b121d]/92 p-5 backdrop-blur-md sm:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#415577] bg-[#0f1928] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#a8ff3f]">
              <Sparkles className="h-3.5 w-3.5" /> FutLynk
            </div>

            <h1 className="mt-3 text-[1.9rem] font-bold leading-tight text-white sm:text-4xl">
              Find Balanced Games.
              <br />
              Coordinate Better.
            </h1>

            <p className="mt-3 text-sm leading-5 text-[#c0cfe5] sm:text-[15px]">
              Tactical recommendations, smarter group overlap, and better-fit futsal sessions released by the platform.
            </p>

            <button
              onClick={onEnter}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#a8ff3f] text-sm font-bold text-[#10170d]"
            >
              Enter FutLynk
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-2 text-center text-[11px] text-[#8da0bd]">Prototype entry only. No credentials required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
