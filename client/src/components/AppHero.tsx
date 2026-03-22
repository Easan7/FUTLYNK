import { type ReactNode } from "react";

interface AppHeroProps {
  kicker?: string;
  title: string;
  subtitle: string;
  badge?: string;
  action?: ReactNode;
  visual?: ReactNode;
  className?: string;
}

export default function AppHero({
  kicker,
  title,
  subtitle,
  badge,
  action,
  visual,
  className = "",
}: AppHeroProps) {
  return (
    <section className={`hero-tactics-shell ${className}`}>
      {visual ? <div className="absolute inset-y-0 right-0 w-[48%] sm:w-[42%]">{visual}</div> : null}
      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
        <div className={visual ? "pr-[35%] sm:pr-[30%]" : ""}>
          {kicker ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#abbbd5]">{kicker}</p>
          ) : null}
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-[28px] sm:leading-8">{title}</h1>
          <p className="mt-1 text-sm leading-5 text-[#d0dbeb]">{subtitle}</p>
          {badge ? (
            <div className="mt-2 inline-flex items-center rounded-full border border-[#4a6286] bg-[#0f1827]/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#95ff56]">
              {badge}
            </div>
          ) : null}
        </div>

        {action ? <div className="self-start">{action}</div> : null}
      </div>
    </section>
  );
}
