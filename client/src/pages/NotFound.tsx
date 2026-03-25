import { Link } from "wouter";
import { Home } from "lucide-react";
import PitchOverlay from "@/components/PitchOverlay";

export default function NotFound() {
  return (
    <div className="app-shell flex items-center justify-center p-4">
      <section className="surface-card pitch-lines relative w-full max-w-sm text-center">
        <PitchOverlay variant="card" />
        <p className="relative z-10 text-[11px] font-medium tracking-[0.12em] text-[#97a59b]">ROUTE ERROR</p>
        <h1 className="relative z-10 mt-2 text-5xl font-semibold text-[#9dff3f]">404</h1>
        <h2 className="relative z-10 mt-1 text-xl font-semibold text-[#edf3ee]">Page Not Found</h2>
        <p className="relative z-10 mt-2 text-sm text-[#97a59b]">
          This page is outside the match route map.
        </p>
        <Link href="/" className="btn-primary relative z-10 mt-5 w-full">
          <Home className="mr-2 h-4 w-4" />
          Back to My Games
        </Link>
      </section>
    </div>
  );
}
