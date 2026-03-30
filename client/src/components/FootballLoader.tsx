import { motion } from "framer-motion";

type FootballLoaderProps = {
  label?: string;
  fullScreen?: boolean;
};

export default function FootballLoader({ label = "Loading...", fullScreen = false }: FootballLoaderProps) {
  const containerClass = fullScreen
    ? "app-shell flex min-h-screen items-center justify-center p-6"
    : "flex w-full items-center justify-center py-10";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="relative h-14 w-14 rounded-full border border-[#78c52f] bg-[#9dff3f] shadow-[0_10px_24px_rgba(157,255,63,0.24)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[#1e3118]" />
          <span className="absolute left-2.5 top-2.5 h-2.5 w-2.5 rounded-[2px] bg-[#2d4723]" />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-[2px] bg-[#2d4723]" />
          <span className="absolute bottom-2.5 left-2.5 h-2.5 w-2.5 rounded-[2px] bg-[#2d4723]" />
          <span className="absolute bottom-2.5 right-2.5 h-2.5 w-2.5 rounded-[2px] bg-[#2d4723]" />
        </motion.div>
        <p className="text-sm text-[#bfd1c0]">{label}</p>
      </div>
    </div>
  );
}
