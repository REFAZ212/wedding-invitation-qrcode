import { useMemo } from "react";

/** Kelopak bunga yang jatuh perlahan menghiasi latar belakang. Dekoratif & non-interaktif. */
export function FallingPetals({ count = 12 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 8,
        size: 10 + Math.random() * 10,
        opacity: 0.35 + Math.random() * 0.35,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-[60%_40%_60%_40%] bg-gold-light animate-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.8,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Bunga garis-emas yang melayang lembut, dipakai sebagai dekorasi ambient per-section. */
export function FloatingFlowers() {
  const positions = [
    { top: "8%", left: "4%", size: 60, delay: "0s" },
    { top: "70%", left: "90%", size: 80, delay: "1.5s" },
    { top: "35%", left: "92%", size: 40, delay: "3s" },
    { top: "85%", left: "8%", size: 50, delay: "2s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {positions.map((pos, i) => (
        <svg
          key={i}
          viewBox="0 0 60 60"
          className="absolute text-gold/25 dark:text-gold-light/20 animate-float-slow"
          style={{ top: pos.top, left: pos.left, width: pos.size, height: pos.size, animationDelay: pos.delay }}
        >
          <path
            d="M30 10 C36 20, 36 30, 30 40 C24 30, 24 20, 30 10 Z"
            fill="currentColor"
          />
          <path
            d="M10 30 C20 24, 30 24, 40 30 C30 36, 20 36, 10 30 Z"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      ))}
    </div>
  );
}
