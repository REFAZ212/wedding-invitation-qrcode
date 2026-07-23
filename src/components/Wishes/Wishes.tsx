import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiHeart } from "react-icons/fi";
import type { Wish } from "@/types";
import { useToast } from "@/hooks/useToast";

const INITIAL_WISHES: Wish[] = [
  {
    id: "w1",
    name: "Sarah & Kevin",
    message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    attendance: "attending",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "w2",
    name: "Budi Santoso",
    message: "Bahagia sekali melihat kalian akhirnya menikah. Selamat menempuh hidup baru!",
    attendance: "attending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

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
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<WishFormValues>();
  const { showToast } = useToast();

  const onSubmit = async (data: WishFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newWish: Wish = {
      id: `w-${Date.now()}`,
      name: data.name,
      message: data.message,
      attendance: "pending",
      createdAt: new Date().toISOString(),
    };
    setWishes((prev) => [newWish, ...prev]);
    reset();
    showToast("Ucapan Anda berhasil dikirim.");
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
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
