import { motion } from "framer-motion";
import { FiInstagram } from "react-icons/fi";
import { weddingConfig } from "@/data/config";

export default function InstagramFilter() {
  const { meta } = weddingConfig;

  return (
    <section className="relative py-16 px-6 sm:px-10 bg-sage-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto text-center text-ivory"
      >
        <FiInstagram className="mx-auto mb-3" size={26} />
        <p className="text-xs tracking-[0.3em] uppercase text-ivory/80 mb-2">Abadikan Momen Anda</p>
        <h3 className="font-script text-3xl mb-4">{meta.hashtag}</h3>
        <p className="text-sm text-ivory/85 mb-6">
          Gunakan tagar ini saat membagikan foto Anda di hari bahagia kami, agar kami bisa mengumpulkan seluruh momen indahnya.
        </p>
        <a
          href={meta.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ivory text-sage-dark text-sm font-medium px-6 py-3 shadow-soft hover:opacity-90 transition-opacity"
        >
          <FiInstagram size={15} /> Lihat di Instagram
        </a>
      </motion.div>
    </section>
  );
}
