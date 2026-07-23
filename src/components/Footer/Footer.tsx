import { motion } from "framer-motion";
import { FiShare2, FiHeart } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import { formatLongDate, shareInvitation, shareToWhatsApp } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";
import Ornament from "@/components/Ornament/Ornament";

export default function Footer() {
  const { bride, groom, weddingDateISO } = weddingConfig;
  const { showToast } = useToast();

  const handleShare = async () => {
    const result = await shareInvitation(
      `Undangan Pernikahan ${bride.nickname} & ${groom.nickname}`,
      window.location.href
    );
    if (result === "copied") showToast("Tautan undangan disalin.");
    if (result === "failed") showToast("Gagal membagikan tautan.", "error");
  };

  const handleWhatsAppShare = () => {
    shareToWhatsApp(
      `Anda diundang ke pernikahan ${bride.nickname} & ${groom.nickname}! Lihat undangan lengkapnya di: ${window.location.href}`
    );
  };

  return (
    <footer className="relative py-16 px-6 text-center bg-charcoal dark:bg-night text-ivory overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center gap-4"
      >
        <Ornament variant="monogram" className="w-14 h-14 text-gold-light" />
        <p className="font-script text-3xl text-gold-light">{bride.nickname} &amp; {groom.nickname}</p>
        <p className="text-sm text-ivory/60">{formatLongDate(weddingDateISO)}</p>

        <p className="max-w-md text-sm text-ivory/70 leading-relaxed mt-3">
          Terima kasih atas doa restu dan kehadiran Bapak/Ibu/Saudara/i. Kebahagiaan kami tidak akan lengkap tanpa dukungan Anda semua.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-medium rounded-full bg-ivory/10 hover:bg-ivory/20 px-5 py-2.5 transition-colors"
          >
            <FiShare2 size={13} /> Bagikan Undangan
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 text-xs font-medium rounded-full bg-sage-gradient px-5 py-2.5 transition-opacity hover:opacity-90"
          >
            Bagikan via WhatsApp
          </button>
        </div>

        <p className="text-[11px] text-ivory/40 mt-8 flex items-center gap-1.5">
          Made with <FiHeart className="text-gold-light" size={11} /> for {bride.nickname} &amp; {groom.nickname}
        </p>
      </motion.div>
    </footer>
  );
}
