import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import Ornament from "@/components/Ornament/Ornament";
import { FloatingFlowers } from "@/components/FloatingElements/FloatingElements";

interface CoverProps {
  guestName: string | null;
  onOpen: () => void;
}

/** Layar sampul penuh sebelum tamu masuk ke undangan. */
export default function Cover({ guestName, onOpen }: CoverProps) {
  const { bride, groom, cover } = weddingConfig;

  return (
    <motion.section
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden bg-charcoal text-ivory px-6 py-10 sm:py-14"
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img
          src={cover.backgroundImage}
          alt=""
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/90" />
      </div>

      <FloatingFlowers />

      {/* Animated particles (simple dots) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-light/70"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 31) % 100}%` }}
            animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -12, 0] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Top: greeting */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-gold-light">
          The Wedding Of
        </p>
      </motion.div>

      {/* Middle: photo + names */}
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-2 ring-gold-light/70 shadow-gold">
            <img src={cover.coupleImage} alt={`${bride.nickname} & ${groom.nickname}`} className="w-full h-full object-cover" />
          </div>
          <Ornament variant="monogram" className="absolute -inset-3 text-gold-light/40 animate-spin-slow" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="font-script text-4xl sm:text-6xl text-gold-light leading-tight"
        >
          {bride.nickname} <span className="text-ivory/70">&amp;</span> {groom.nickname}
        </motion.h1>

        <Ornament variant="divider" className="w-40 text-gold-light/70" />

        {guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-2 flex flex-col items-center gap-1"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-ivory/60 flex items-center gap-2">
              <FiMail /> Kepada Yth.
            </p>
            <p className="font-display text-xl sm:text-2xl text-ivory">{guestName}</p>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="max-w-xs sm:max-w-md text-sm sm:text-base text-ivory/75 leading-relaxed mt-1"
        >
          {cover.greeting}
        </motion.p>
      </div>

      {/* Bottom: open button */}
      <motion.button
        type="button"
        onClick={onOpen}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="relative z-10 group flex items-center gap-3 rounded-full bg-gold-gradient px-8 py-4 text-charcoal font-body font-medium tracking-wide shadow-gold"
      >
        <FiMail className="group-hover:rotate-[-8deg] transition-transform" />
        Buka Undangan
      </motion.button>
    </motion.section>
  );
}
