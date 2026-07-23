import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiCalendar, FiTruck, FiPhone, FiExternalLink } from "react-icons/fi";
import { weddingConfig, contactPersons } from "@/data/config";
import { formatLongDate, downloadCalendarEvent } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";
import type { EventSchedule } from "@/types";

function EventCard({ event, index }: { event: EventSchedule; index: number }) {
  const { showToast } = useToast();

  const handleAddToCalendar = () => {
    downloadCalendarEvent({
      title: event.name,
      description: `${event.name} di ${event.location}`,
      location: event.address,
      startISO: `${event.date}T${event.timeStart}:00`,
      endISO: `${event.date}T${event.timeEnd}:00`,
    });
    showToast(`${event.name} ditambahkan ke kalender.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="rounded-3xl bg-ivory/80 dark:bg-night-soft/80 backdrop-blur-sm border border-gold/15 shadow-soft p-7 sm:p-8 flex flex-col gap-4"
    >
      <h3 className="font-display text-2xl text-gold-dark dark:text-gold-light">{event.name}</h3>

      <div className="flex items-start gap-3 text-sm text-charcoal/75 dark:text-ivory/75">
        <FiCalendar className="mt-0.5 shrink-0 text-sage-dark dark:text-sage-light" />
        <span>{formatLongDate(event.date)}</span>
      </div>
      <div className="flex items-start gap-3 text-sm text-charcoal/75 dark:text-ivory/75">
        <FiClock className="mt-0.5 shrink-0 text-sage-dark dark:text-sage-light" />
        <span>{event.timeStart} – {event.timeEnd} WIB</span>
      </div>
      <div className="flex items-start gap-3 text-sm text-charcoal/75 dark:text-ivory/75">
        <FiMapPin className="mt-0.5 shrink-0 text-sage-dark dark:text-sage-light" />
        <span>
          {event.location}
          <br />
          <span className="text-charcoal/55 dark:text-ivory/55">{event.address}</span>
        </span>
      </div>
      {event.dressCode && (
        <div className="flex items-start gap-3 text-sm text-charcoal/75 dark:text-ivory/75">
          <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-gold-gradient" />
          <span>Dress code: {event.dressCode}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-2">
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium rounded-full bg-gold-gradient text-ivory px-4 py-2.5 shadow-gold hover:opacity-90 transition-opacity"
        >
          <FiExternalLink size={13} /> Buka Google Maps
        </a>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="flex items-center gap-1.5 text-xs font-medium rounded-full border border-gold text-gold-dark dark:text-gold-light px-4 py-2.5 hover:bg-gold hover:text-ivory dark:hover:text-charcoal transition-colors"
        >
          <FiCalendar size={13} /> Tambah ke Kalender
        </button>
      </div>
    </motion.div>
  );
}

export default function Event() {
  const { events } = weddingConfig;

  return (
    <section id="event" className="relative py-20 px-6 sm:px-10">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Save The Date
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">Rangkaian Acara</h2>
      </div>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      {/* Live map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-soft border border-gold/15"
      >
        <iframe
          title="Lokasi acara pernikahan"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(events[1].address)}&output=embed`}
          className="w-full h-72 sm:h-96 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>

      {/* Parking & contact */}
      <div className="max-w-4xl mx-auto mt-8 grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-sage/10 dark:bg-sage/10 border border-sage/20 p-6 flex gap-3">
          <FiTruck className="shrink-0 mt-0.5 text-sage-dark dark:text-sage-light" />
          <p className="text-sm text-charcoal/70 dark:text-ivory/70">
            Area parkir tersedia luas di halaman gedung, dibantu oleh petugas parkir kami.
          </p>
        </div>
        <div className="rounded-2xl bg-gold/10 border border-gold/20 p-6">
          <p className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-ivory mb-3">
            <FiPhone className="text-gold-dark dark:text-gold-light" /> Contact Person
          </p>
          <ul className="space-y-1.5">
            {contactPersons.map((c) => (
              <li key={c.name} className="text-sm text-charcoal/70 dark:text-ivory/70">
                {c.name} — <span className="text-gold-dark dark:text-gold-light">{c.phone}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
