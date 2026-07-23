import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { FiShield } from "react-icons/fi";
import Ornament from "@/components/Ornament/Ornament";

interface InvitationQRProps {
  /** Token QR yang sudah ditandatangani backend (HMAC) — bukan URL maupun nama tamu. */
  qrToken: string;
  maxGuests: number;
  checkedIn: boolean;
}

/**
 * QR Code tiket masuk resmi tamu. Meng-encode token aman yang ditandatangani
 * backend, sehingga tidak bisa dipalsukan dan hanya bisa dipakai satu kali
 * (divalidasi sepenuhnya di server saat check-in).
 */
export default function InvitationQR({ qrToken, maxGuests, checkedIn }: InvitationQRProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-4 py-10 px-6"
    >
      <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light">
        Tiket Masuk Digital
      </p>

      <div className="relative p-5 rounded-3xl bg-ivory shadow-gold ring-1 ring-gold/25">
        <Ornament variant="corner" className="absolute -top-3 -left-3 w-10 h-10 text-gold" />
        <Ornament variant="corner" className="absolute -bottom-3 -right-3 w-10 h-10 text-gold rotate-180" />
        <QRCodeSVG value={qrToken} size={160} fgColor="#2E2A24" bgColor="#FBF7F0" level="M" />
        {checkedIn && (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory/85 rounded-3xl">
            <span className="rotate-[-8deg] border-2 border-sage-dark text-sage-dark font-display text-lg px-3 py-1 rounded">
              Sudah Check-In
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-charcoal/60 dark:text-ivory/60">
        <FiShield size={13} className="text-gold-dark dark:text-gold-light" />
        Berlaku untuk maksimal {maxGuests} orang
      </div>

      <p className="text-sm text-center text-charcoal/60 dark:text-ivory/60 max-w-xs">
        Mohon tunjukkan QR Code ini kepada petugas di pintu masuk untuk verifikasi kehadiran.
      </p>
    </motion.div>
  );
}
