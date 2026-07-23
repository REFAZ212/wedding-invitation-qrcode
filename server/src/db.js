import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "..", "data", "db.json");

const defaultData = {
  invitations: [],
  auditLogs: [],
};

const adapter = new JSONFile(dbFile);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= structuredClone(defaultData);
  await db.write();
}

/** Membuat undangan baru. Mengembalikan record lengkap (termasuk qrToken). */
export async function createInvitation({ guestName, maxGuests = 2 }) {
  await db.read();
  const id = nanoid(12);

  let invitationCode = generateInvitationCode();
  while (db.data.invitations.some((inv) => inv.invitationCode === invitationCode)) {
    invitationCode = generateInvitationCode();
  }

  const now = new Date().toISOString();

  const record = {
    id,
    guestName,
    invitationCode,
    maxGuests,
    checkedIn: false,
    checkedInAt: null,
    checkedInBy: null,
    scanCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.data.invitations.push(record);
  await db.write();
  return record;
}

/** Mencari undangan berdasarkan kode undangan (case-insensitive). */
export async function findByCode(code) {
  await db.read();
  const normalized = String(code || "").trim().toUpperCase();
  return db.data.invitations.find((inv) => inv.invitationCode === normalized) || null;
}

/** Mencari undangan berdasarkan id internal (dipakai untuk verifikasi QR token). */
export async function findById(id) {
  await db.read();
  return db.data.invitations.find((inv) => inv.id === id) || null;
}

export async function listInvitations() {
  await db.read();
  return [...db.data.invitations].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Menandai undangan sebagai check-in. Idempotent guard dilakukan di layer route. */
export async function markCheckedIn(id, checkedInBy) {
  await db.read();
  const record = db.data.invitations.find((inv) => inv.id === id);
  if (!record) return null;
  record.checkedIn = true;
  record.checkedInAt = new Date().toISOString();
  record.checkedInBy = checkedInBy || "Unknown";
  record.updatedAt = record.checkedInAt;
  await db.write();
  return record;
}

export async function incrementScanCount(id) {
  await db.read();
  const record = db.data.invitations.find((inv) => inv.id === id);
  if (!record) return null;
  record.scanCount += 1;
  await db.write();
  return record;
}

export async function addAuditLog(entry) {
  await db.read();
  db.data.auditLogs.push({
    id: nanoid(10),
    timestamp: new Date().toISOString(),
    ...entry,
  });
  // Batasi log agar file tidak tumbuh tak terbatas (simpan 2000 entri terakhir)
  if (db.data.auditLogs.length > 2000) {
    db.data.auditLogs = db.data.auditLogs.slice(-2000);
  }
  await db.write();
}

export async function listAuditLogs(limit = 100) {
  await db.read();
  return [...db.data.auditLogs].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, limit);
}

export async function getStatistics() {
  await db.read();
  const invitations = db.data.invitations;
  const total = invitations.length;
  const checkedIn = invitations.filter((inv) => inv.checkedIn).length;
  const notArrived = total - checkedIn;
  const totalGuestCapacity = invitations.reduce((sum, inv) => sum + inv.maxGuests, 0);
  const percentage = total > 0 ? Math.round((checkedIn / total) * 1000) / 10 : 0;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCheckIns = invitations.filter(
    (inv) => inv.checkedIn && inv.checkedInAt && inv.checkedInAt.slice(0, 10) === todayStr
  ).length;

  return {
    totalInvitations: total,
    invitationsSent: total, // dianggap "terkirim" begitu dibuat; sesuaikan bila ada alur pengiriman terpisah
    guestsCheckedIn: checkedIn,
    guestsNotYetArrived: notArrived,
    totalGuestCapacity,
    percentageAttendance: percentage,
    todayCheckIns,
  };
}

/** Membuat kode undangan acak, non-sekuensial, dan mudah dibaca (tanpa karakter ambigu). */
function generateInvitationCode(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa 0/O/1/I agar tidak ambigu
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return code;
}
