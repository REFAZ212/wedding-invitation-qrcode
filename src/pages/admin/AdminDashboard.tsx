import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiUsers, FiSend, FiCheckCircle, FiClock, FiPercent, FiCalendar, FiPlus, FiCopy, FiCheck, FiDownload } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import * as XLSX from "xlsx";
import AdminLoginGate from "@/components/Admin/AdminLoginGate";
import {
  adminGetStatistics,
  adminGetHistory,
  adminListInvitations,
  adminGenerateInvitation,
  type DashboardStatistics,
  type AuditLogEntry,
  type InvitationRecord,
  type GeneratedInvitation,
} from "@/services/api";
import { copyToClipboard } from "@/utils/helpers";

const POLL_INTERVAL_MS = 5000;
const PIE_COLORS = ["#7C8B6F", "#E4C97D"];

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "text-gold-dark dark:text-gold-light",
}: {
  icon: typeof FiUsers;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-ivory dark:bg-night-soft border border-gold/15 shadow-soft p-5 flex flex-col gap-2"
    >
      <div className={`w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center ${accent}`}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-display text-charcoal dark:text-ivory">{value}</p>
      <p className="text-xs text-charcoal/50 dark:text-ivory/50">{label}</p>
    </motion.div>
  );
}

function GenerateInvitationForm({
  token,
  onGenerated,
}: {
  token: string;
  onGenerated: (inv: GeneratedInvitation) => void;
}) {
  const [guestName, setGuestName] = useState("");
  const [maxGuests, setMaxGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<GeneratedInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!guestName.trim()) return;
    setIsSubmitting(true);
    try {
      const invitation = await adminGenerateInvitation({ guestName: guestName.trim(), maxGuests }, token);
      setLastGenerated(invitation);
      onGenerated(invitation);
      setGuestName("");
      setMaxGuests(2);
    } catch {
      /* dibiarkan */
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!lastGenerated) return;
    const fullUrl = `${window.location.origin}${lastGenerated.invitationUrl}`;
    const ok = await copyToClipboard(fullUrl);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-ivory dark:bg-night-soft border border-gold/15 shadow-soft p-6">
      <h3 className="font-display text-lg text-charcoal dark:text-ivory mb-4 flex items-center gap-2">
        <FiPlus className="text-gold-dark dark:text-gold-light" /> Buat Undangan Baru
      </h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Nama tamu"
          className="flex-1 rounded-xl border border-gold/25 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        <input
          type="number"
          min={1}
          max={20}
          value={maxGuests}
          onChange={(e) => setMaxGuests(Number(e.target.value))}
          className="w-full sm:w-28 rounded-xl border border-gold/25 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          aria-label="Maksimal jumlah tamu"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !guestName.trim()}
          className="rounded-xl bg-gold-gradient text-ivory text-sm font-medium px-5 py-2.5 shadow-gold disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? "Membuat..." : "Generate"}
        </button>
      </div>

      {lastGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-gold/10 p-4"
        >
          <div className="p-2 bg-ivory rounded-lg shrink-0">
            <QRCodeSVG value={lastGenerated.qrToken} size={72} fgColor="#2E2A24" bgColor="#FBF7F0" />
          </div>
          <div className="flex-1 text-sm">
            <p className="text-charcoal dark:text-ivory font-medium">{lastGenerated.guestName}</p>
            <p className="text-charcoal/60 dark:text-ivory/60">
              Kode: <span className="font-mono tracking-wider">{lastGenerated.invitationCode}</span>
            </p>
            <p className="text-charcoal/60 dark:text-ivory/60">Maks. {lastGenerated.maxGuests} tamu</p>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-medium rounded-full border border-gold text-gold-dark dark:text-gold-light px-4 py-2"
          >
            {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
            {copied ? "Tersalin" : "Salin Tautan"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Salin kode"
      className="inline-flex items-center gap-1 text-charcoal/50 dark:text-ivory/50 hover:text-gold-dark dark:hover:text-gold-light transition-colors"
    >
      {copied ? <FiCheck size={13} className="text-sage" /> : <FiCopy size={13} />}
    </button>
  );
}

function InvitationsTable({ invitations }: { invitations: InvitationRecord[] }) {
  return (
    <div className="rounded-2xl bg-ivory dark:bg-night-soft border border-gold/15 shadow-soft overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50 dark:text-ivory/50 border-b border-gold/15">
            <th className="px-4 py-3">Nama Tamu</th>
            <th className="px-4 py-3">Kode</th>
            <th className="px-4 py-3">Maks.</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Check-in</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr key={inv.id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 text-charcoal dark:text-ivory">{inv.guestName}</td>
              <td className="px-4 py-3 font-mono text-xs tracking-wider text-charcoal/70 dark:text-ivory/70 flex items-center gap-2">
                {inv.invitationCode}
                <CopyButton text={inv.invitationCode} />
              </td>
              <td className="px-4 py-3 text-charcoal/70 dark:text-ivory/70">{inv.maxGuests}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    inv.checkedIn
                      ? "bg-sage/15 text-sage-dark dark:text-sage-light"
                      : "bg-charcoal/5 dark:bg-ivory/10 text-charcoal/50 dark:text-ivory/50"
                  }`}
                >
                  {inv.checkedIn ? "Hadir" : "Belum Hadir"}
                </span>
              </td>
              <td className="px-4 py-3 text-charcoal/60 dark:text-ivory/60 text-xs">
                {inv.checkedInAt ? new Date(inv.checkedInAt).toLocaleString("id-ID") : "—"}
              </td>
            </tr>
          ))}
          {invitations.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-charcoal/40 dark:text-ivory/40">
                Belum ada undangan dibuat.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function HistoryTable({ logs }: { logs: AuditLogEntry[] }) {
  const actionLabel: Record<AuditLogEntry["action"], string> = {
    scan_success: "Berhasil",
    scan_duplicate: "Sudah Dipakai",
    scan_invalid: "Tidak Valid",
  };

  return (
    <div className="rounded-2xl bg-ivory dark:bg-night-soft border border-gold/15 shadow-soft overflow-x-auto">
      <table className="w-full text-sm min-w-[520px]">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50 dark:text-ivory/50 border-b border-gold/15">
            <th className="px-4 py-3">Waktu</th>
            <th className="px-4 py-3">Kode</th>
            <th className="px-4 py-3">Hasil</th>
            <th className="px-4 py-3">Petugas</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-gold/10 last:border-0">
              <td className="px-4 py-3 text-charcoal/60 dark:text-ivory/60 text-xs">
                {new Date(log.timestamp).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 font-mono text-xs tracking-wider text-charcoal/70 dark:text-ivory/70">
                {log.invitationCode || "—"}
              </td>
              <td className="px-4 py-3 text-xs">{actionLabel[log.action]}</td>
              <td className="px-4 py-3 text-charcoal/70 dark:text-ivory/70">{log.scannedBy}</td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-charcoal/40 dark:text-ivory/40">
                Belum ada aktivitas scan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DashboardPanel({ token }: { token: string }) {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [history, setHistory] = useState<AuditLogEntry[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const refreshAll = useCallback(async () => {
    const [statsRes, historyRes, invitationsRes] = await Promise.allSettled([
      adminGetStatistics(token),
      adminGetHistory(token, 30),
      adminListInvitations(token),
    ]);
    if (statsRes.status === "fulfilled") setStats(statsRes.value);
    if (historyRes.status === "fulfilled") setHistory(historyRes.value.logs);
    if (invitationsRes.status === "fulfilled") setInvitations(invitationsRes.value.invitations);
  }, [token]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshAll]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const allInvitations: InvitationRecord[] = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const res = await adminListInvitations(token, page, 200);
        allInvitations.push(...res.invitations);
        hasMore = page < res.totalPages;
        page++;
      }

      const wsData = [
        ["No", "Nama Tamu", "Kode Undangan", "Maks Tamu", "Status", "Check-in Oleh", "Waktu Check-in", "Waktu Dibuat"],
        ...allInvitations.map((inv, i) => [
          i + 1,
          inv.guestName,
          inv.invitationCode,
          inv.maxGuests,
          inv.checkedIn ? "Hadir" : "Belum Hadir",
          inv.checkedInBy || "—",
          inv.checkedInAt ? new Date(inv.checkedInAt).toLocaleString("id-ID") : "—",
          new Date(inv.createdAt).toLocaleString("id-ID"),
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 5 },
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
        { wch: 12 },
        { wch: 15 },
        { wch: 22 },
        { wch: 22 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data Undangan");

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      XLSX.writeFile(wb, `undangan-wedding-${dateStr}.xlsx`);
    } catch {
      /* error export */
    } finally {
      setIsExporting(false);
    }
  };

  const pieData = stats
    ? [
        { name: "Hadir", value: stats.guestsCheckedIn },
        { name: "Belum Hadir", value: stats.guestsNotYetArrived },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={FiUsers} label="Total Undangan" value={stats?.totalInvitations ?? "—"} />
        <StatCard icon={FiSend} label="Undangan Terkirim" value={stats?.invitationsSent ?? "—"} />
        <StatCard icon={FiCheckCircle} label="Tamu Check-in" value={stats?.guestsCheckedIn ?? "—"} accent="text-sage-dark dark:text-sage-light" />
        <StatCard icon={FiClock} label="Belum Hadir" value={stats?.guestsNotYetArrived ?? "—"} />
        <StatCard icon={FiPercent} label="Persentase Kehadiran" value={stats ? `${stats.percentageAttendance}%` : "—"} />
        <StatCard icon={FiCalendar} label="Check-in Hari Ini" value={stats?.todayCheckIns ?? "—"} />
      </div>

      {stats && stats.totalInvitations > 0 && (
        <div className="rounded-2xl bg-ivory dark:bg-night-soft border border-gold/15 shadow-soft p-6 flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[0] }} />
              Hadir: {stats.guestsCheckedIn}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[1] }} />
              Belum Hadir: {stats.guestsNotYetArrived}
            </div>
            <p className="text-xs text-charcoal/50 dark:text-ivory/50 mt-1">
              Kapasitas total tamu (termasuk pendamping): {stats.totalGuestCapacity}
            </p>
          </div>
        </div>
      )}

      <GenerateInvitationForm token={token} onGenerated={() => refreshAll()} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-charcoal dark:text-ivory">Daftar Undangan</h3>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExporting || invitations.length === 0}
            className="flex items-center gap-2 rounded-xl border border-gold/25 bg-transparent text-charcoal dark:text-ivory text-sm font-medium px-4 py-2 hover:bg-gold/10 disabled:opacity-50 transition-colors"
          >
            <FiDownload size={14} />
            {isExporting ? "Mengekspor..." : "Download Excel"}
          </button>
        </div>
        <InvitationsTable invitations={invitations} />
      </div>

      <div>
        <h3 className="font-display text-lg text-charcoal dark:text-ivory mb-3">Riwayat Scan Terbaru</h3>
        <HistoryTable logs={history} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLoginGate title="Wedding Dashboard">
      {(token) => <DashboardPanel token={token} />}
    </AdminLoginGate>
  );
}
