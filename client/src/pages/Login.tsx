import { useState } from "react";
import { Input } from "@/components/ui/input";

interface LoginProps {
  onEnter: () => void;
}

export default function Login({ onEnter }: LoginProps) {
  const [remember, setRemember] = useState(true);

  return (
    <div className="min-h-screen bg-[#060907] px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-medium text-[#8f9f95]">FUTSAL COORDINATION</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#f2f7f2]">FutLynk</h1>
        </div>

        <section className="surface-card">
          <h2 className="section-heading">Sign In</h2>
          <p className="section-subtext">Use your account to join and manage games.</p>

          <div className="mt-4 space-y-3">
            <Input placeholder="Email" type="email" />
            <Input placeholder="Password" type="password" />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#a0ada4]">
            <label className="inline-flex items-center gap-2">
              <input
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-[#3b453d] bg-[#121713] accent-[#9dff3f]"
              />
              Remember me
            </label>
            <button className="text-[#c8d2ca]">Forgot password?</button>
          </div>

          <button onClick={onEnter} className="btn-primary mt-4 w-full">
            Sign In
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={onEnter} className="btn-secondary text-xs">
              Google
            </button>
            <button onClick={onEnter} className="btn-secondary text-xs">
              Facebook
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
