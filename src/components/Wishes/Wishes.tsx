import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiHeart } from "react-icons/fi";
import type { Wish } from "@/types";
import { useToast } from "@/hooks/useToast";
import { submitWish, fetchWishes, ApiError } from "@/services/api";

interface WishFormValues {
  name: string;
  message: string;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Baru saja";
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<WishFormValues>();
  const { showToast } = useToast();

  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      const result = await fetchWishes(1, 50);
      setWishes(
        result.wishes.map((w) => ({
          id: w.id,
          name: w.name,
          message: w.message,
          attendance: w.attendance as Wish["attendance"],
          createdAt: w.createdAt,
        }))
      );
    } catch {
      setWishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: WishFormValues) => {
    try {
      const result = await submitWish({ name: data.name, message: data.message });
      const newWish: Wish = {
        id: result.id,
        name: result.name,
        message: result.message,
        attendance: result.attendance as Wish["attendance"],
        createdAt: result.createdAt,
      };
      setWishes((prev) => [newWish, ...prev]);
      reset();
      showToast("Ucapan Anda berhasil dikirim.");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Gagal mengirim ucapan. Coba lagi nanti.";
      showToast(msg);
    }
  };

  return (
    <section id="wishes" className="relative py-20 px-6 sm:px-10 bg-cream/50 dark:bg-night-soft/30">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Doa &amp; Ucapan
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory">Wishes</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-3 mb-10 rounded-2xl bg-ivory/80 dark:bg-night-soft/80 border border-gold/15 p-4 shadow-soft"
        >
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Nama Anda"
              {...register("name", { required: true })}
              className="rounded-xl border border-gold/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <input
              type="text"
              placeholder="Tulis ucapan dan doa..."
              {...register("message", { required: true })}
              className="rounded-xl border border-gold/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gold-gradient text-ivory text-sm font-medium px-5 py-2.5 shadow-gold disabled:opacity-60 self-end sm:self-auto"
          >
            <FiSend size={14} /> Kirim
          </button>
        </form>

        <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
          {isLoading ? (
            <p className="text-center text-sm text-charcoal/40 dark:text-ivory/40 py-8">Memuat ucapan...</p>
          ) : (
            <AnimatePresence initial={false}>
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-ivory/70 dark:bg-night-soft/70 border border-gold/10 p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-medium text-sm text-charcoal dark:text-ivory flex items-center gap-1.5">
                      <FiHeart size={12} className="text-gold" /> {wish.name}
                    </p>
                    <span className="text-[11px] text-charcoal/40 dark:text-ivory/40">{relativeTime(wish.createdAt)}</span>
                  </div>
                  <p className="text-sm text-charcoal/70 dark:text-ivory/70 leading-relaxed">{wish.message}</p>
                </motion.div>
              ))}
              {wishes.length === 0 && (
                <p className="text-center text-sm text-charcoal/40 dark:text-ivory/40 py-8">
                  Belum ada ucapan. Jadilah yang pertama!
                </p>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
