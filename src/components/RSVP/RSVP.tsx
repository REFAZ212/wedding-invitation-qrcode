import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiUser, FiPhone, FiUsers, FiMessageSquare } from "react-icons/fi";
import type { RSVPFormValues } from "@/types";
import { useToast } from "@/hooks/useToast";

export default function RSVP() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RSVPFormValues>({
    defaultValues: { attendance: "attending", guests: 1 },
  });
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (data: RSVPFormValues) => {
    // Simulasi pengiriman data ke server / Google Sheets / backend pilihan Anda.
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log("RSVP submitted:", data);
    setSubmitted(true);
    showToast("Terima kasih, konfirmasi kehadiran Anda telah kami terima.");
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="rsvp" className="relative py-20 px-6 sm:px-10">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Konfirmasi Kehadiran
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">RSVP</h2>
      </div>

      <div className="max-w-lg mx-auto relative rounded-3xl bg-ivory/80 dark:bg-night-soft/80 backdrop-blur-sm border border-gold/15 shadow-soft p-7 sm:p-9">
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 rounded-3xl bg-ivory/95 dark:bg-night-soft/95 flex flex-col items-center justify-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-16 h-16 rounded-full bg-sage-gradient flex items-center justify-center text-ivory"
              >
                <FiCheck size={28} />
              </motion.div>
              <p className="font-display text-xl text-charcoal dark:text-ivory">Terima Kasih!</p>
              <p className="text-sm text-charcoal/60 dark:text-ivory/60 text-center max-w-xs">
                Konfirmasi kehadiran Anda telah kami terima dengan baik.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-ivory mb-1.5">
              <FiUser className="text-gold-dark dark:text-gold-light" size={14} /> Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Nama wajib diisi" })}
              className="w-full rounded-xl border border-gold/25 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              placeholder="Nama Anda"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-ivory mb-1.5">
              <FiPhone className="text-gold-dark dark:text-gold-light" size={14} /> Nomor Telepon
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone", { required: "Nomor telepon wajib diisi" })}
              className="w-full rounded-xl border border-gold/25 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              placeholder="08xx-xxxx-xxxx"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="guests" className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-ivory mb-1.5">
              <FiUsers className="text-gold-dark dark:text-gold-light" size={14} /> Jumlah Tamu
            </label>
            <input
              id="guests"
              type="number"
              min={1}
              max={5}
              {...register("guests", { required: true, min: 1, max: 5, valueAsNumber: true })}
              className="w-full rounded-xl border border-gold/25 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-charcoal dark:text-ivory mb-2">Konfirmasi Kehadiran</legend>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer rounded-xl border border-gold/25 px-4 py-2.5 text-sm text-center has-[:checked]:bg-gold-gradient has-[:checked]:text-ivory has-[:checked]:border-transparent transition-colors">
                <input type="radio" value="attending" {...register("attendance")} className="sr-only" />
                Hadir
              </label>
              <label className="flex-1 cursor-pointer rounded-xl border border-gold/25 px-4 py-2.5 text-sm text-center has-[:checked]:bg-charcoal has-[:checked]:text-ivory dark:has-[:checked]:bg-ivory dark:has-[:checked]:text-charcoal has-[:checked]:border-transparent transition-colors">
                <input type="radio" value="not_attending" {...register("attendance")} className="sr-only" />
                Tidak Hadir
              </label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-ivory mb-1.5">
              <FiMessageSquare className="text-gold-dark dark:text-gold-light" size={14} /> Pesan (opsional)
            </label>
            <textarea
              id="message"
              rows={3}
              {...register("message")}
              className="w-full rounded-xl border border-gold/25 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
              placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 rounded-full bg-gold-gradient text-ivory font-medium py-3 shadow-gold disabled:opacity-60"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
          </motion.button>
        </form>
      </div>
    </section>
  );
}
