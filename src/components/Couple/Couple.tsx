import { motion } from "framer-motion";
import { FiInstagram } from "react-icons/fi";
import type { Person } from "@/types";
import { weddingConfig } from "@/data/config";
import Ornament from "@/components/Ornament/Ornament";

function PersonCard({ person, align }: { person: Person; align: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7 }}
      className="flex-1 flex flex-col items-center text-center rounded-3xl bg-ivory/70 dark:bg-night-soft/70 backdrop-blur-sm border border-gold/15 shadow-soft px-6 py-8"
    >
      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-2 ring-gold-light/60 mb-4 shadow-gold">
        <img src={person.photo} alt={person.fullName} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-ivory">{person.fullName}</h3>
      <p className="font-script text-xl text-gold-dark dark:text-gold-light mt-1">&ldquo;{person.nickname}&rdquo;</p>
      <p className="text-sm text-charcoal/60 dark:text-ivory/60 mt-3 max-w-[220px]">{person.parents}</p>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-sage-dark dark:text-sage-light hover:text-gold-dark dark:hover:text-gold-light transition-colors"
        >
          <FiInstagram size={13} /> {person.instagram}
        </a>
      )}
    </motion.div>
  );
}

export default function Couple() {
  const { bride, groom } = weddingConfig;

  return (
    <section id="couple" className="relative py-20 px-6 sm:px-10">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Kedua Mempelai
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">
          Dengan Penuh Syukur
        </h2>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-4">
        <PersonCard person={bride} align="left" />

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="shrink-0 mx-2 hidden md:block"
        >
          <Ornament variant="monogram" className="w-16 h-16 text-gold" />
        </motion.div>
        <div className="md:hidden font-script text-3xl text-gold">&amp;</div>

        <PersonCard person={groom} align="right" />
      </div>
    </section>
  );
}
