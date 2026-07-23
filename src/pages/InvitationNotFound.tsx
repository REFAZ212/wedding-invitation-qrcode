import { motion } from "framer-motion";
import { FiMail, FiAlertCircle } from "react-icons/fi";
import Ornament from "@/components/Ornament/Ornament";

interface InvitationNotFoundProps {
  /** Variasi pesan: 'invalid' untuk kode salah/kadaluarsa, 'missing' untuk root tanpa kode sama sekali. */
  variant?: "invalid" | "missing";
}

/**
 * Halaman ditampilkan ketika kode undangan tidak ditemukan atau tidak valid.
 * Sengaja tidak membocorkan informasi internal apa pun (tidak menyebutkan apakah
 * kode "hampir benar", tidak menampilkan detail server, dsb).
 */
export default function InvitationNotFound({ variant = "invalid" }: InvitationNotFoundProps) {
  const isMissing = variant === "missing";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-ivory dark:bg-night text-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream/60 via-ivory to-ivory dark:from-night-soft/40 dark:via-night dark:to-night" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-5 max-w-md"
      >
        <Ornament variant="monogram" className="w-16 h-16 text-gold/60" />

        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
          <FiAlertCircle className="text-gold-dark dark:text-gold-light" size={24} />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-ivory">
          {isMissing ? "Undangan Pribadi Diperlukan" : "Undangan Tidak Ditemukan"}
        </h1>

        <Ornament variant="divider" className="w-32 text-gold" />

        <p className="text-sm text-charcoal/65 dark:text-ivory/65 leading-relaxed">
          {isMissing
            ? "Silakan buka undangan ini melalui tautan pribadi yang telah kami kirimkan kepada Anda, agar kami dapat menampilkan sambutan yang sesuai."
            : "Tautan yang Anda buka tidak valid atau sudah tidak berlaku. Silakan periksa kembali tautan undangan yang telah kami kirimkan."}
        </p>

        <div className="flex items-center gap-2 text-xs text-charcoal/50 dark:text-ivory/50 mt-2">
          <FiMail size={13} />
          Hubungi mempelai atau keluarga bila Anda merasa ini keliru.
        </div>
      </motion.div>
    </div>
  );
}
