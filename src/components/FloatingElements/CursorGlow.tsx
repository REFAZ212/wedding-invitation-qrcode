import { useEffect, useRef } from "react";

/** Lingkaran cahaya lembut yang mengikuti kursor di layar desktop untuk sentuhan mewah. */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handleMove = (e: MouseEvent) => {
      const el = glowRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-[1] hidden sm:block w-[300px] h-[300px] rounded-full opacity-[0.06] dark:opacity-[0.08] bg-gold blur-3xl transition-transform duration-300 ease-out will-change-transform"
      aria-hidden="true"
    />
  );
}
