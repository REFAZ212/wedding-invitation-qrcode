import { motion } from "framer-motion";
import { weddingConfig } from "@/data/config";
import Ornament from "@/components/Ornament/Ornament";

export default function Timeline() {
  const { timeline } = weddingConfig;

  return (
    <section id="love-story" className="relative py-20 px-6 sm:px-10 bg-cream/50 dark:bg-night-soft/30">
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Perjalanan Kami
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">Love Story</h2>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gold/25 md:-translate-x-1/2" aria-hidden="true" />

        <div className="flex flex-col gap-12">
          {timeline.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 pl-16 md:pl-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <span className="absolute left-6 md:left-1/2 top-1 w-3.5 h-3.5 -translate-x-1/2 rounded-full bg-gold-gradient ring-4 ring-ivory dark:ring-night shadow-gold" />

                <div className={`md:w-1/2 ${isEven ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                  <div className="rounded-2xl overflow-hidden shadow-soft mb-3 max-w-xs md:ml-auto">
                    <img src={item.photo} alt={item.title} className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-gold-dark dark:text-gold-light mb-1">
                    {item.date}
                  </p>
                  <h3 className="font-display text-xl text-charcoal dark:text-ivory mb-1.5">{item.title}</h3>
                  <p className="text-sm text-charcoal/65 dark:text-ivory/65 leading-relaxed max-w-sm md:ml-auto">
                    {item.story}
                  </p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <Ornament variant="divider" className="w-40 text-gold mx-auto mt-14" />
    </section>
  );
}
