import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiCameraOff, FiCheck, FiX, FiAlertTriangle, FiUser } from "react-icons/fi";
import AdminLoginGate from "@/components/Admin/AdminLoginGate";
import { adminCheckin, type CheckinResult } from "@/services/api";

const SCANNER_ELEMENT_ID = "qr-scanner-region";

function ResultCard({ result, onDismiss }: { result: CheckinResult; onDismiss: () => void }) {
  const config = {
    success: {
      icon: FiCheck,
      bg: "bg-sage-gradient",
      label: "Allowed Entry",
      border: "border-sage",
    },
    already_used: {
      icon: FiAlertTriangle,
      bg: "bg-gold-gradient",
      label: "Invitation Already Used",
      border: "border-gold",
    },
    invalid: {
      icon: FiX,
      bg: "bg-gradient-to-br from-red-500 to-red-700",
      label: "Invalid Invitation",
      border: "border-red-500",
    },
  }[result.status];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-3xl bg-ivory dark:bg-night-soft border-2 ${config.border} shadow-soft p-6 flex flex-col items-center text-center gap-3`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={`w-16 h-16 rounded-full ${config.bg} flex items-center justify-center text-ivory`}
      >
        <Icon size={28} />
      </motion.div>

      <p className="font-display text-xl text-charcoal dark:text-ivory">{config.label}</p>

      {result.status !== "invalid" && (
        <div className="w-full flex flex-col gap-1.5 text-sm mt-2">
          {result.guestName && (
            <p className="text-charcoal dark:text-ivory">
              <span className="text-charcoal/50 dark:text-ivory/50">Nama:</span> {result.guestName}
            </p>
          )}
          {result.invitationCode && (
            <p className="text-charcoal dark:text-ivory">
              <span className="text-charcoal/50 dark:text-ivory/50">Kode:</span> {result.invitationCode}
            </p>
          )}
          {result.maxGuests !== undefined && (
            <p className="text-charcoal dark:text-ivory">
              <span className="text-charcoal/50 dark:text-ivory/50">Maks. Tamu:</span> {result.maxGuests}
            </p>
          )}
          {result.checkedInAt && (
            <p className="text-charcoal dark:text-ivory">
              <span className="text-charcoal/50 dark:text-ivory/50">Check-in:</span>{" "}
              {new Date(result.checkedInAt).toLocaleString("id-ID")}
            </p>
          )}
          {result.checkedInBy && (
            <p className="text-charcoal dark:text-ivory">
              <span className="text-charcoal/50 dark:text-ivory/50">Oleh:</span> {result.checkedInBy}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 rounded-full bg-charcoal dark:bg-ivory text-ivory dark:text-charcoal text-sm font-medium px-6 py-2.5"
      >
        Scan Berikutnya
      </button>
    </motion.div>
  );
}

function CheckinPanel({ adminKey }: { adminKey: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [staffName, setStaffName] = useState(() => sessionStorage.getItem("wedding_staff_name") || "");
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    sessionStorage.setItem("wedding_staff_name", staffName);
  }, [staffName]);

  const handleResult = async (payload: { token?: string; code?: string }) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setIsProcessing(true);
    try {
      const res = await adminCheckin({ ...payload, staffName: staffName || "Unknown" }, adminKey);
      setResult(res);
      await stopScanning();
    } catch {
      setResult({ status: "invalid", message: "Invalid Invitation" });
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        lockRef.current = false;
      }, 800);
    }
  };

  const startScanning = async () => {
    setScannerError(null);
    setResult(null);
    try {
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          handleResult({ token: decodedText });
        },
        () => {
          /* diabaikan — dipanggil terus-menerus saat belum ada QR di frame */
        }
      );
      setIsScanning(true);
    } catch {
      setScannerError("Tidak dapat mengakses kamera. Periksa izin kamera pada browser Anda.");
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch {
      /* scanner mungkin sudah berhenti */
    }
    scannerRef.current = null;
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    handleResult({ code: manualCode.trim() });
    setManualCode("");
  };

  const handleDismissResult = () => {
    setResult(null);
    startScanning();
  };

  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-ivory mb-1.5">
          <FiUser size={14} className="text-gold-dark dark:text-gold-light" /> Nama Petugas
        </label>
        <input
          type="text"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
          placeholder="Nama Anda (untuk catatan check-in)"
          className="w-full rounded-xl border border-gold/25 bg-ivory dark:bg-night-soft px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <ResultCard key="result" result={result} onDismiss={handleDismissResult} />
        ) : (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="rounded-3xl overflow-hidden bg-charcoal aspect-square relative">
              <div id={SCANNER_ELEMENT_ID} className="w-full h-full" />
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ivory/70">
                  <FiCameraOff size={28} />
                  <p className="text-xs">Kamera belum aktif</p>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                  <span className="text-ivory text-sm">Memvalidasi...</span>
                </div>
              )}
            </div>

            {scannerError && <p className="text-xs text-red-500 text-center">{scannerError}</p>}

            <button
              type="button"
              onClick={isScanning ? stopScanning : startScanning}
              className="flex items-center justify-center gap-2 rounded-full bg-gold-gradient text-ivory text-sm font-medium py-3 shadow-gold"
            >
              {isScanning ? <FiCameraOff size={15} /> : <FiCamera size={15} />}
              {isScanning ? "Hentikan Kamera" : "Mulai Scan QR"}
            </button>

            <div className="flex items-center gap-3 text-xs text-charcoal/40 dark:text-ivory/40">
              <div className="h-px bg-gold/20 flex-1" /> atau input manual <div className="h-px bg-gold/20 flex-1" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                placeholder="Kode undangan, mis. A8F3K9XZ"
                className="flex-1 rounded-xl border border-gold/25 bg-ivory dark:bg-night-soft px-4 py-2.5 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="button"
                onClick={handleManualSubmit}
                disabled={isProcessing}
                className="rounded-xl border border-gold text-gold-dark dark:text-gold-light text-sm font-medium px-4 disabled:opacity-50"
              >
                Cek
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminCheckin() {
  return (
    <AdminLoginGate title="Wedding Check-In">
      {(adminKey) => <CheckinPanel adminKey={adminKey} />}
    </AdminLoginGate>
  );
}
