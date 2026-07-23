import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownProps {
  targetISO: string;
}

const UNITS: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
];

export default function Countdown({ targetISO }: CountdownProps) {
  const countdown = useCountdown(targetISO);

  if (countdown.isComplete) {
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-2xl sm:text-3xl text-gold-dark dark:text-gold-light text-center"
      >
        Hari Pernikahan Telah Tiba ❤️
      </motion.p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5" role="timer" aria-label="Hitung mundur menuju hari pernikahan">
      {UNITS.map((unit, i) => (
        <motion.div
          key={unit.key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="flex flex-col items-center gap-1 min-w-[60px] sm:min-w-[76px] rounded-2xl bg-ivory/70 dark:bg-night-soft/70 backdrop-blur-sm border border-gold/20 py-3 sm:py-4 shadow-soft"
        >
          <span className="font-display text-2xl sm:text-4xl text-gold-dark dark:text-gold-light tabular-nums">
            {String(countdown[unit.key]).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-charcoal/60 dark:text-ivory/60">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
