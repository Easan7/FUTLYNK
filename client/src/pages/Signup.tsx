import { useState } from "react";
import { Input } from "@/components/ui/input";
import { apiPost, setCurrentUserId } from "@/lib/api";

interface SignupProps {
  onEnter: () => void;
  onGoLogin: () => void;
}

export default function Signup({ onEnter, onGoLogin }: SignupProps) {
  const [agree, setAgree] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!agree || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const payload = await apiPost<{ userId: string }>("/api/v1/auth/signup", {
        display_name: displayName.trim(),
        username: username.trim(),
        email: email.trim() || null,
      });
      setCurrentUserId(payload.userId);
      onEnter();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#060907] px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-4">
          <h1 className="mt-1 text-3xl font-semibold text-[#f2f7f2]">FutLynk</h1>
          <p className="mt-2 text-sm text-[#a7b6ab]">Sign up for an account and start playing/coordinating games with ease</p>
        </div>

        <section className="mb-3 rounded-xl border border-[#355235] bg-[#132014] p-3">
          <p className="text-xs text-[#cfe6cd]">What you get right away</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="chip chip-active">Smart Match Discovery</span>
            <span className="chip chip-active">Group Coordination</span>
            <span className="chip chip-active">Individual Profile</span>
          </div>
        </section>

        <section className="surface-card border-[#334133] bg-[#101a11]">
          <h2 className="section-heading">Create Your Account</h2>
          <p className="section-subtext">Set up your details to enter FUTLYNK.</p>

          <div className="mt-4 space-y-3">
            <Input placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input placeholder="Username (e.g. alexchen)" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <label className="mt-3 inline-flex items-center gap-2 text-xs text-[#a0ada4]">
            <input
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-[#3b453d] bg-[#121713] accent-[#9dff3f]"
            />
            I agree to the terms
          </label>

          {error ? <p className="mt-3 text-xs text-[#ffd1d1]">{error}</p> : null}

          <button onClick={() => void submit()} className="btn-primary mt-4 w-full" disabled={!agree || !displayName.trim() || !username.trim() || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          <button onClick={onGoLogin} className="btn-secondary mt-2 w-full text-xs">
            I already have an account · Log In
          </button>
        </section>
      </div>
    </div>
  );
}
