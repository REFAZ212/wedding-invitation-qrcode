import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import { weddingConfig } from "@/data/config";

export default function Protocol() {
  const { notes } = weddingConfig;

  return (
    <section className="relative py-16 px-6 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto rounded-3xl bg-ivory/70 dark:bg-night-soft/70 border border-gold/15 p-7 sm:p-8"
      >
        <div className="flex items-center gap-2 justify-center mb-5">
          <FiInfo className="text-gold-dark dark:text-gold-light" />
          <h3 className="font-display text-xl text-charcoal dark:text-ivory">Catatan Untuk Tamu Undangan</h3>
        </div>
        <ul className="flex flex-col gap-3">
          {notes.map((note, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-charcoal/70 dark:text-ivory/70">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              {note}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
