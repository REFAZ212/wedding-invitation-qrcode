import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#C9A24B", "#E4C97D", "#7C8B6F", "#A9B79A", "#FBF7F0"];

/** Ledakan confetti singkat, dipicu satu kali saat pengguna membuka undangan. */
export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600,
        y: -(200 + Math.random() * 300),
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.3,
        size: 6 + Math.random() * 6,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] flex items-start justify-center overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-1/3 rounded-sm"
          style={{ width: p.size, height: p.size * 0.6, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y * -1, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
