import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck, FiDownload, FiGift } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import { copyToClipboard } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";
import type { BankAccount, QrisAccount } from "@/types";

function BankCard({ account, index }: { account: BankAccount; index: number }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const ok = await copyToClipboard(account.accountNumber);
    setCopied(ok);
    if (ok) showToast("Nomor rekening disalin.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-3xl bg-gradient-to-br from-charcoal to-charcoal/85 dark:from-night-soft dark:to-night text-ivory p-6 shadow-soft relative overflow-hidden"
    >
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gold/10" aria-hidden="true" />
      <img src={account.logo} alt={account.bankName} className="h-6 mb-6 opacity-90" onError={(e) => (e.currentTarget.style.display = "none")} />
      <p className="text-xs uppercase tracking-widest text-ivory/50 mb-1">{account.bankName}</p>
      <p className="font-display text-2xl tracking-wider mb-1">{account.accountNumber}</p>
      <p className="text-sm text-ivory/70 mb-5">a.n. {account.accountHolder}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 text-xs font-medium rounded-full bg-ivory/10 hover:bg-ivory/20 px-4 py-2 transition-colors"
      >
        {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
        {copied ? "Tersalin" : "Salin Nomor Rekening"}
      </button>
    </motion.div>
  );
}

function QrisCard({ qris, index }: { qris: QrisAccount; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-3xl bg-ivory/80 dark:bg-night-soft/80 border border-gold/15 shadow-soft p-6 flex flex-col items-center text-center"
    >
      <p className="text-sm font-medium text-charcoal dark:text-ivory mb-4">{qris.label}</p>
      <div className="w-40 h-40 rounded-2xl overflow-hidden ring-1 ring-gold/20 mb-4 bg-white">
        <img src={qris.image} alt={`QRIS ${qris.label}`} className="w-full h-full object-contain" />
      </div>
      <a
        href={qris.image}
        download
        className="flex items-center gap-1.5 text-xs font-medium rounded-full border border-gold text-gold-dark dark:text-gold-light px-4 py-2 hover:bg-gold hover:text-ivory dark:hover:text-charcoal transition-colors"
      >
        <FiDownload size={12} /> Unduh QR
      </a>
    </motion.div>
  );
}

export default function Gift() {
  const { bankAccounts, qris } = weddingConfig;

  return (
    <section id="gift" className="relative py-20 px-6 sm:px-10">
      <div className="text-center mb-12">
        <FiGift className="mx-auto mb-3 text-gold-dark dark:text-gold-light" size={22} />
        <p className="text-xs tracking-[0.35em] uppercase text-sage-dark dark:text-sage-light mb-3">
          Tanda Kasih
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-ivory mb-3">Wedding Gift</h2>
        <p className="text-sm text-charcoal/60 dark:text-ivory/60 max-w-md mx-auto">
          Doa restu Anda adalah karunia yang berarti bagi kami. Namun jika ingin memberi kado, kami sediakan pilihan berikut.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5 mb-6">
        {bankAccounts.map((account, i) => (
          <BankCard key={account.id} account={account} index={i} />
        ))}
      </div>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
        {qris.map((q, i) => (
          <QrisCard key={q.id} qris={q} index={i} />
        ))}
      </div>
    </section>
  );
}
