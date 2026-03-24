import { type ReactNode } from "react";

interface AppHeroProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  action?: ReactNode;
  className?: string;
}

export default function AppHero({ kicker, title, subtitle, badge, action, className = "" }: AppHeroProps) {
  return (
    <section className={`surface-card pitch-lines ${className}`}>
      {kicker ? <p className="text-[11px] font-medium text-[#95a59a]">{kicker}</p> : null}
      <h1 className="mt-1 text-xl font-semibold text-[#f2f7f2]">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-[#9ca9a0]">{subtitle}</p> : null}
      <div className="mt-3 flex items-center justify-between gap-3">
        {badge ? <span className="chip chip-active">{badge}</span> : <span />}
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}
