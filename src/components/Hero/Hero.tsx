import { motion } from "framer-motion";
import { FiChevronDown, FiCalendar } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import { formatLongDate, downloadCalendarEvent } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";
import Ornament from "@/components/Ornament/Ornament";
import Countdown from "@/components/Countdown/Countdown";

export default function Hero() {
  const { bride, groom, weddingDateISO, quote, cover, events } = weddingConfig;
  const { showToast } = useToast();

  const handleSaveDate = () => {
    const main = events[0];
    downloadCalendarEvent({
      title: `Pernikahan ${bride.nickname} & ${groom.nickname}`,
      description: `${main.name} — ${bride.nickname} & ${groom.nickname}`,
      location: main.address,
      startISO: weddingDateISO,
      endISO: weddingDateISO,
    });
    showToast("Tanggal berhasil disimpan ke kalender.");
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:pt-32">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <img src={cover.backgroundImage} alt="" className="w-full h-full object-cover opacity-15 dark:opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/95 to-ivory dark:from-night dark:via-night/95 dark:to-night" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs sm:text-sm tracking-[0.4em] uppercase text-sage-dark dark:text-sage-light mb-4"
      >
        We&apos;re Getting Married
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-56 h-72 sm:w-72 sm:h-96 rounded-[3rem] overflow-hidden shadow-soft mb-6"
      >
        <img src={cover.coupleImage} alt={`${bride.fullName} & ${groom.fullName}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 ring-1 ring-inset ring-gold-light/40 rounded-[3rem]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="font-display text-4xl sm:text-6xl text-center leading-tight text-charcoal dark:text-ivory"
      >
        {bride.nickname}
        <span className="block font-script text-2xl sm:text-3xl text-gold-dark dark:text-gold-light my-1">&amp;</span>
        {groom.nickname}
      </motion.h1>

      <Ornament variant="divider" className="w-40 text-gold my-4" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-sm sm:text-base tracking-wide text-charcoal/70 dark:text-ivory/70 mb-8"
      >
        {formatLongDate(weddingDateISO)}
      </motion.p>

      <div className="mb-8 w-full">
        <Countdown targetISO={weddingDateISO} />
      </div>

      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-md text-center text-sm sm:text-base italic text-charcoal/70 dark:text-ivory/70 leading-relaxed mb-2"
      >
        &ldquo;{quote.text}&rdquo;
      </motion.blockquote>
      <cite className="text-xs text-gold-dark dark:text-gold-light not-italic mb-8">{quote.source}</cite>

      <motion.button
        type="button"
        onClick={handleSaveDate}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-full border border-gold px-7 py-3 text-sm font-medium tracking-wide text-gold-dark dark:text-gold-light hover:bg-gold hover:text-ivory dark:hover:text-charcoal transition-colors"
      >
        <FiCalendar /> Save The Date
      </motion.button>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-12 text-gold/60"
        aria-hidden="true"
      >
        <FiChevronDown size={22} />
      </motion.div>
    </section>
  );
}
