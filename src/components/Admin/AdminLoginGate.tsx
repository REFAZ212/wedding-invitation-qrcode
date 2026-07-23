import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { FiLock, FiLogOut } from "react-icons/fi";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Ornament from "@/components/Ornament/Ornament";

interface AdminLoginGateProps {
  title: string;
  children: (adminKey: string, logout: () => void) => ReactNode;
}

/**
 * Membungkus halaman admin (check-in / dashboard) dengan gerbang login sederhana.
 * Admin key dimasukkan manual oleh staff dan diverifikasi ke backend — tidak pernah
 * ditanam di kode/env frontend, dan hanya disimpan di sessionStorage (per-tab, sementara).
 */
export default function AdminLoginGate({ title, children }: AdminLoginGateProps) {
  const { adminKey, isAuthenticated, isVerifying, error, login, logout } = useAdminAuth();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await login(input.trim());
  };

  if (!isAuthenticated || !adminKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl bg-ivory dark:bg-night-soft p-8 shadow-soft"
        >
          <div className="flex flex-col items-center gap-3 mb-6">
            <Ornament variant="monogram" className="w-12 h-12 text-gold" />
            <h1 className="font-display text-xl text-charcoal dark:text-ivory">{title}</h1>
            <p className="text-xs text-charcoal/50 dark:text-ivory/50 text-center">
              Halaman ini khusus untuk staff. Masukkan admin key untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-ivory/40" size={15} />
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Admin key"
                autoFocus
                className="w-full rounded-xl border border-gold/25 bg-transparent pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isVerifying}
              className="rounded-full bg-gold-gradient text-ivory text-sm font-medium py-2.5 shadow-gold disabled:opacity-60"
            >
              {isVerifying ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/40 dark:bg-night">
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-charcoal text-ivory">
        <span className="font-display text-lg">{title}</span>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-ivory/70 hover:text-ivory transition-colors"
        >
          <FiLogOut size={13} /> Keluar
        </button>
      </div>
      {children(adminKey, logout)}
    </div>
  );
}
