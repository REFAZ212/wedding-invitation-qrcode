import { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiCopy, FiCheck } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import { copyToClipboard } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";

/** Amplop digital berisi alamat pengiriman kado fisik (opsional). */
export default function Envelope() {
  const { envelope } = weddingConfig;
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const fullAddress = `${envelope.recipientName}\n${envelope.address}`;
    const ok = await copyToClipboard(fullAddress);
    setCopied(ok);
    if (ok) showToast("Alamat pengiriman disalin.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-16 px-6 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto rounded-3xl border border-dashed border-gold/40 p-7 text-center"
      >
        <FiMapPin className="mx-auto mb-3 text-gold-dark dark:text-gold-light" size={20} />
        <h3 className="font-display text-xl text-charcoal dark:text-ivory mb-2">Kirim Kado Fisik</h3>
        <p className="text-sm text-charcoal/65 dark:text-ivory/65 mb-1">{envelope.recipientName}</p>
        <p className="text-sm text-charcoal/65 dark:text-ivory/65 mb-5">{envelope.address}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 text-xs font-medium rounded-full border border-gold text-gold-dark dark:text-gold-light px-4 py-2.5 hover:bg-gold hover:text-ivory dark:hover:text-charcoal transition-colors"
        >
          {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
          {copied ? "Alamat Tersalin" : "Salin Alamat"}
        </button>
      </motion.div>
    </section>
  );
}
