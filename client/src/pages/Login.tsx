import { useState } from "react";
import { Input } from "@/components/ui/input";
import { apiPost, setCurrentUserId } from "@/lib/api";

interface LoginProps {
  onEnter: () => void;
  onGoSignup?: () => void;
}

export default function Login({ onEnter, onGoSignup }: LoginProps) {
  const [remember, setRemember] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!identifier.trim() || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const payload = await apiPost<{ userId: string }>("/api/v1/auth/login", {
        identifier: identifier.trim(),
      });
      setCurrentUserId(payload.userId);
      onEnter();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#060907] px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-medium text-[#8f9f95]">FUTSAL COORDINATION</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#f2f7f2]">FutLynk</h1>
        </div>

        <section className="surface-card">
          <h2 className="section-heading">Sign In</h2>
          <p className="section-subtext">Use username or email to access your account.</p>

          <div className="mt-4 space-y-3">
            <Input
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
            />
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
            <span className="text-[#8f9f95]">No password needed in MVP</span>
          </div>

          {error ? <p className="mt-2 text-xs text-[#ffd1d1]">{error}</p> : null}

          <button onClick={() => void submit()} className="btn-primary mt-4 w-full" disabled={isSubmitting || !identifier.trim()}>
            {isSubmitting ? "Signing In..." : "Continue"}
          </button>

          {onGoSignup ? (
            <button onClick={onGoSignup} className="btn-secondary mt-2 w-full text-xs">
              Create a new account
            </button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
