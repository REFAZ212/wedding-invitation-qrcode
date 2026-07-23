import dayjs from "dayjs";

/** Menyalin teks ke clipboard, mengembalikan status berhasil/gagal. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Format tanggal panjang berbahasa Indonesia, mis. "Sabtu, 14 November 2026". */
export function formatLongDate(iso: string): string {
  const locale: Record<number, string> = {
    0: "Minggu",
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
  };
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const d = dayjs(iso);
  return `${locale[d.day()]}, ${d.date()} ${months[d.month()]} ${d.year()}`;
}

/** Membuat dan mengunduh berkas .ics agar acara bisa ditambahkan ke kalender. */
export function downloadCalendarEvent(params: {
  title: string;
  description: string;
  location: string;
  startISO: string;
  endISO: string;
}): void {
  const { title, description, location, startISO, endISO } = params;
  const toICSDate = (iso: string) => dayjs(iso).format("YYYYMMDDTHHmmss");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${toICSDate(startISO)}`,
    `DTEND:${toICSDate(endISO)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/\s+/g, "-")}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Membuka WhatsApp dengan pesan berisi tautan undangan. */
export function shareToWhatsApp(message: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Menggunakan Web Share API bila tersedia, fallback ke copy link. */
export async function shareInvitation(title: string, url: string): Promise<"shared" | "copied" | "failed"> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch {
      /* pengguna membatalkan share, coba fallback */
    }
  }
  const copied = await copyToClipboard(url);
  return copied ? "copied" : "failed";
}
