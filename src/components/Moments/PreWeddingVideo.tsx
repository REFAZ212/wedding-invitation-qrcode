import { motion } from "framer-motion";
import { weddingConfig } from "@/data/config";

export default function PreWeddingVideo() {
  const { video } = weddingConfig;
  if (!video) return null;

  return (
    <section className="relative py-20 px-6 sm:px-10 bg-cream/50 dark:bg-night-soft/30">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Cinematic
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">{video.title}</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-soft ring-1 ring-gold/20 aspect-video"
      >
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </motion.div>
    </section>
  );
}
