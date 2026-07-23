import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Zoom } from "swiper/modules";
import { FiX, FiZoomIn } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import "swiper/css";
import "swiper/css/zoom";

const SPAN_CLASSES: Record<string, string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  normal: "",
};

export default function Gallery() {
  const { gallery } = weddingConfig;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-20 px-6 sm:px-10 bg-cream/50 dark:bg-night-soft/30">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Kenangan Kami
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">Galeri Foto</h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 auto-rows-[140px] sm:auto-rows-[180px] gap-3">
        {gallery.map((img, index) => (
          <motion.button
            key={img.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
            className={`group relative overflow-hidden rounded-2xl ${SPAN_CLASSES[img.span ?? "normal"]}`}
            aria-label={`Perbesar foto: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors flex items-center justify-center">
              <FiZoomIn className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity" size={22} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-charcoal/95 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Galeri foto layar penuh"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-ivory/10 text-ivory flex items-center justify-center hover:bg-ivory/20 transition-colors"
              aria-label="Tutup galeri"
            >
              <FiX size={20} />
            </button>
            <Swiper
              modules={[Zoom, Keyboard]}
              zoom
              keyboard
              initialSlide={activeIndex}
              className="w-full h-full max-w-4xl max-h-[80vh]"
            >
              {gallery.map((img) => (
                <SwiperSlide key={img.id} className="flex items-center justify-center">
                  <div className="swiper-zoom-container">
                    <img src={img.src} alt={img.alt} className="max-h-[80vh] w-auto mx-auto object-contain" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
