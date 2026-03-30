import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck2,
  Coins,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { onboardingSlides, type OnboardingSlide } from "@/data/onboardingSlides";

type OnboardingFlowProps = {
  onFinish: () => void;
};

const solidBackgroundByTheme: Record<OnboardingSlide["theme"], string> = {
  core: "#1b2b1a",
  discover: "#1a2f1b",
  groups: "#1d311d",
  allinone: "#1b2d1f",
};

function SlideArt({ slide }: { slide: OnboardingSlide }) {
  if (slide.theme === "discover") {
    return (
      <div className="relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#4f7149] bg-[#102112] p-3.5 shadow-[0_20px_38px_rgba(6,14,8,0.32)]">
          <div className="mb-2 flex items-center justify-between text-[11px] text-[#b9ccb8]">
            <span className="inline-flex items-center gap-1">
              <MapPinned className="h-3.5 w-3.5 text-[#9dff3f]" />
              Nearby Rooms
            </span>
            <span>Fit</span>
          </div>
          <div className="space-y-2">
            {[
              { text: "Downtown Sports Arena", fit: "Best" },
              { text: "Metro Futsal Complex", fit: "Strong" },
              { text: "Westgate Indoor Sports", fit: "Solid" },
            ].map((item) => (
              <div key={item.text} className="flex items-center justify-between rounded-xl border border-[#334633] bg-[#18291a] px-2.5 py-2">
                <span className="text-xs text-[#dce8dc]">{item.text}</span>
                <span className="rounded-full bg-[#9dff3f]/15 px-2 py-0.5 text-[10px] font-semibold text-[#bfff86]">
                  {item.fit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (slide.theme === "groups") {
    return (
      <div className="relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#4f7149] bg-[#102112] p-3.5 shadow-[0_20px_38px_rgba(6,14,8,0.32)]">
          <p className="mb-2 text-[11px] text-[#b9ccb8]">Group Availability</p>
          <div className="grid grid-cols-3 gap-2">
            {["A", "S", "D"].map((initial, i) => (
              <div key={initial} className="grid h-8 w-8 place-items-center rounded-full border border-[#3d5738] bg-[#1a2d1d] text-xs text-[#d6e7d5]">
                {i === 0 ? <Users className="h-3.5 w-3.5 text-[#9dff3f]" /> : initial}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-[#3d5738] bg-[#1c2f1e] px-2 py-1.5 text-center text-[11px] text-[#cff0b5]">Yes 3</div>
            <div className="rounded-lg border border-[#3d5738] bg-[#1c2f1e] px-2 py-1.5 text-center text-[11px] text-[#d6e4d6]">Wait 1</div>
            <div className="rounded-lg border border-[#5b3a3a] bg-[#311f1f] px-2 py-1.5 text-center text-[11px] text-[#e5b5b5]">Declined 1</div>
          </div>
          <div className="mt-2 rounded-lg border border-[#4f713c] bg-[#223517] px-2 py-1.5 text-center text-[11px] font-semibold text-[#c9ff8d]">
            Auto-Join Ready
          </div>
        </div>
      </div>
    );
  }

  if (slide.theme === "allinone") {
    return (
      <div className="relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#4f7149] bg-[#102112] p-3.5 shadow-[0_20px_38px_rgba(6,14,8,0.32)]">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[#334633] bg-[#18291a] p-2">
              <CalendarCheck2 className="h-4 w-4 text-[#9dff3f]" />
              <p className="mt-1 text-[11px] text-[#d9e6d9]">Upcoming Games</p>
            </div>
            <div className="rounded-xl border border-[#334633] bg-[#18291a] p-2">
              <MessageSquare className="h-4 w-4 text-[#9dff3f]" />
              <p className="mt-1 text-[11px] text-[#d9e6d9]">Chat</p>
            </div>
            <div className="rounded-xl border border-[#334633] bg-[#18291a] p-2">
              <Coins className="h-4 w-4 text-[#9dff3f]" />
              <p className="mt-1 text-[11px] text-[#d9e6d9]">Wallet & Points</p>
            </div>
            <div className="rounded-xl border border-[#334633] bg-[#18291a] p-2">
              <ShieldCheck className="h-4 w-4 text-[#9dff3f]" />
              <p className="mt-1 text-[11px] text-[#d9e6d9]">Ratings</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#4f7149] bg-[#102112] p-3.5 shadow-[0_20px_38px_rgba(6,14,8,0.32)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[#b9ccb8]">FUTLYNK Matchday</p>
          <Target className="h-4 w-4 text-[#9dff3f]" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-[#334633] bg-[#18291a] px-2 py-2 text-center text-[11px] text-[#d8e6d8]">My Games</div>
          <div className="rounded-xl border border-[#334633] bg-[#18291a] px-2 py-2 text-center text-[11px] text-[#d8e6d8]">Search</div>
          <div className="rounded-xl border border-[#334633] bg-[#18291a] px-2 py-2 text-center text-[11px] text-[#d8e6d8]">Groups</div>
        </div>
        <div className="mt-2 rounded-xl border border-[#334633] bg-[#18291a] px-2 py-2 text-center text-[11px] text-[#d8e6d8]">Profile</div>
      </div>
    </div>
  );
}

export default function OnboardingFlow({ onFinish }: OnboardingFlowProps) {
  const [index, setIndex] = useState(0);
  const slide = onboardingSlides[index];
  const isLast = index === onboardingSlides.length - 1;
  const progressText = useMemo(() => `${index + 1} / ${onboardingSlides.length}`, [index]);
  const progressPct = ((index + 1) / onboardingSlides.length) * 100;

  const goNext = () => (isLast ? onFinish() : setIndex((prev) => prev + 1));
  const goPrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div
      className="fixed inset-0 z-[80] overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: solidBackgroundByTheme[slide.theme] }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(190,255,120,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(190,255,120,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "0px 28px"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-[max(1.2rem,env(safe-area-inset-top))]">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#2f472f]">
          <motion.div
            className="h-full rounded-full bg-[#beff78]"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 26 }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d6ebd1]" style={{ fontFamily: '"Rajdhani","Barlow",sans-serif' }}>
            FUTLYNK
          </p>
          <button onClick={onFinish} className="text-sm font-medium text-[#f5fff2] underline-offset-2 hover:underline">
            Skip
          </button>
        </div>

        <div className="mt-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="flex h-full flex-col"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) goNext();
                if (info.offset.x > 70) goPrev();
              }}
            >
              <motion.div
                className="relative h-[45vh] min-h-[290px]"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              >
                <SlideArt slide={slide} />
              </motion.div>

              <div className="mt-3 text-center">
                <h1
                  className="text-[clamp(2.05rem,6.8vw,2.9rem)] font-semibold leading-[1.02] text-[#f8fff5]"
                  style={{ fontFamily: '"Rajdhani","Barlow",sans-serif' }}
                >
                  {slide.title}
                </h1>
                <p className="mx-auto mt-4 max-w-[31ch] text-[1rem] leading-relaxed text-[#d5e5d2]">
                  {slide.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            {onboardingSlides.map((item, dotIndex) => (
              <span
                key={item.id}
                className={`h-2.5 rounded-full transition-all duration-250 ${
                  dotIndex === index ? "w-7 bg-[#beff78]" : "w-2.5 bg-[#6f8f6d]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="btn-primary w-full text-base shadow-[0_14px_30px_rgba(157,255,63,0.24)]"
            style={{ fontFamily: '"Rajdhani","Barlow",sans-serif' }}
          >
            {isLast ? "Get Started" : "Continue"}
          </button>
          <p className="mt-3 text-center text-xs text-[#afc5ae]">{progressText}</p>
        </div>
      </div>
    </div>
  );
}
