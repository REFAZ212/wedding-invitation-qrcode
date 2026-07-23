import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { weddingConfig } from "@/data/config";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function Moments() {
  const { gallery } = weddingConfig;

  return (
    <section className="relative py-20 px-6 sm:px-10 overflow-hidden">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Sekilas
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">Our Moments</h2>
      </div>

      <Swiper
        modules={[Autoplay, EffectCoverflow, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{ rotate: 20, stretch: 0, depth: 120, modifier: 1.4, slideShadows: false }}
        autoplay={{ delay: 3200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="max-w-5xl mx-auto pb-12 our-moments-swiper"
      >
        {gallery.map((img) => (
          <SwiperSlide key={img.id} className="!w-64 sm:!w-80">
            <div className="rounded-3xl overflow-hidden shadow-soft aspect-[3/4]">
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
