import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "wedding.db");

let _db = null;

export function getDb() {
  if (!_db) throw new Error("Database not initialized. Call initDb() first.");
  return _db;
}

export function initDb() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("synchronous = NORMAL");
  db.pragma("cache_size = -64000");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      invitation_code TEXT NOT NULL UNIQUE,
      max_guests INTEGER NOT NULL DEFAULT 2,
      checked_in INTEGER NOT NULL DEFAULT 0,
      checked_in_at TEXT,
      checked_in_by TEXT,
      scan_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(invitation_code);
    CREATE INDEX IF NOT EXISTS idx_invitations_checked_in ON invitations(checked_in);

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      action TEXT NOT NULL,
      scan_method TEXT,
      scanned_by TEXT NOT NULL DEFAULT 'Unknown',
      invitation_code TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

    CREATE TABLE IF NOT EXISTS rsvps (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      phone TEXT,
      guests INTEGER NOT NULL DEFAULT 1,
      attendance TEXT NOT NULL DEFAULT 'attending',
      message TEXT,
      invitation_code TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      message TEXT NOT NULL,
      attendance TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_wishes_created ON wishes(created_at DESC);
  `);

  _db = db;
  return db;
}

export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}

// ─── Invitation CRUD ──────────────────────────────────────────────

export function createInvitation({ guestName, maxGuests = 2 }) {
  const db = getDb();
  const id = nanoid(12);
  let invitationCode = generateInvitationCode();
  const existing = db.prepare("SELECT 1 FROM invitations WHERE invitation_code = ?").get(invitationCode);
  if (existing) {
    invitationCode = generateInvitationCode();
  }
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO invitations (id, guest_name, invitation_code, max_guests, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, guestName, invitationCode, maxGuests, now, now);
  return findById(id);
}

export function createInvitationsBulk(guests) {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO invitations (id, guest_name, invitation_code, max_guests, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const results = [];
  const now = new Date().toISOString();
  const tx = db.transaction((guestList) => {
    for (const { guestName, maxGuests = 2 } of guestList) {
      const id = nanoid(12);
      let invitationCode = generateInvitationCode();
      while (db.prepare("SELECT 1 FROM invitations WHERE invitation_code = ?").get(invitationCode)) {
        invitationCode = generateInvitationCode();
      }
      insert.run(id, guestName, invitationCode, maxGuests, now, now);
      results.push({ id, guestName, invitationCode, maxGuests });
    }
  });
  tx(guests);
  return results;
}

export function findByCode(code) {
  const db = getDb();
  const normalized = String(code || "").trim().toUpperCase();
  return db.prepare("SELECT * FROM invitations WHERE invitation_code = ?").get(normalized) || null;
}

export function findById(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM invitations WHERE id = ?").get(id) || null;
}

export function listInvitations({ page = 1, limit = 50, search = "" } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  let where = "";
  const params = [];
  if (search) {
    where = "WHERE guest_name LIKE ? OR invitation_code LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }
  const total = db.prepare(`SELECT COUNT(*) as count FROM invitations ${where}`).get(...params).count;
  const invitations = db.prepare(
    `SELECT * FROM invitations ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset);
  return { invitations, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function markCheckedIn(id, checkedInBy) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE invitations SET checked_in = 1, checked_in_at = ?, checked_in_by = ?, updated_at = ?
    WHERE id = ?
  `).run(now, checkedInBy || "Unknown", now, id);
  return findById(id);
}

export function processCheckIn(id, staffName) {
  const db = getDb();
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    const invitation = db.prepare("SELECT * FROM invitations WHERE id = ?").get(id);
    if (!invitation) return { invitation: null, result: "not_found" };
    db.prepare("UPDATE invitations SET scan_count = scan_count + 1 WHERE id = ?").run(id);
    if (invitation.checked_in) {
      return { invitation, result: "already_used" };
    }
    db.prepare(`
      UPDATE invitations SET checked_in = 1, checked_in_at = ?, checked_in_by = ?, updated_at = ?
      WHERE id = ?
    `).run(now, staffName || "Unknown", now, id);
    addAuditLog({ action: "scan_success", scanMethod: null, scannedBy: staffName, invitationCode: invitation.invitation_code });
    return { invitation: findById(id), result: "success" };
  });
  return tx();
}

export function addAuditLog({ action, scanMethod, scannedBy, invitationCode }) {
  const db = getDb();
  const id = nanoid(10);
  const timestamp = new Date().toISOString();
  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, action, scan_method, scanned_by, invitation_code)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, timestamp, action, scanMethod, scannedBy || "Unknown", invitationCode);
  db.prepare(`
    DELETE FROM audit_logs WHERE id NOT IN (
      SELECT id FROM audit_logs ORDER BY timestamp DESC LIMIT 5000
    )
  `).run();
}

export function listAuditLogs(limit = 100) {
  const db = getDb();
  return db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?").all(limit);
}

export function getStatistics() {
  const db = getDb();
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN checked_in = 1 THEN 1 ELSE 0 END) as checked_in,
      SUM(max_guests) as total_capacity,
      SUM(CASE WHEN checked_in = 1 AND date(checked_in_at) = date('now') THEN 1 ELSE 0 END) as today_checkins
    FROM invitations
  `).get();
  const total = row.total || 0;
  const checkedIn = row.checked_in || 0;
  return {
    totalInvitations: total,
    invitationsSent: total,
    guestsCheckedIn: checkedIn,
    guestsNotYetArrived: total - checkedIn,
    totalGuestCapacity: row.total_capacity || 0,
    percentageAttendance: total > 0 ? Math.round((checkedIn / total) * 1000) / 10 : 0,
    todayCheckIns: row.today_checkins || 0,
  };
}

// ─── RSVP CRUD ────────────────────────────────────────────────────

export function createRsvp({ name, phone, guests, attendance, message, invitationCode }) {
  const db = getDb();
  const id = nanoid(10);
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO rsvps (id, guest_name, phone, guests, attendance, message, invitation_code, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, phone || null, guests || 1, attendance, message || null, invitationCode || null, now);
  return { id, name, phone, guests, attendance, message, invitationCode, createdAt: now };
}

export function listRsvps({ page = 1, limit = 50 } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  const total = db.prepare("SELECT COUNT(*) as count FROM rsvps").get().count;
  const rsvps = db.prepare("SELECT * FROM rsvps ORDER BY created_at DESC LIMIT ? OFFSET ?").all(limit, offset);
  return { rsvps, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Wishes CRUD ──────────────────────────────────────────────────

export function createWish({ name, message, attendance }) {
  const db = getDb();
  const id = nanoid(10);
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO wishes (id, guest_name, message, attendance, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, message, attendance || "pending", now);
  return { id, name, message, attendance: attendance || "pending", createdAt: now };
}

export function listWishes({ page = 1, limit = 50 } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  const total = db.prepare("SELECT COUNT(*) as count FROM wishes").get().count;
  const wishes = db.prepare("SELECT * FROM wishes ORDER BY created_at DESC LIMIT ? OFFSET ?").all(limit, offset);
  return { wishes, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Helpers ──────────────────────────────────────────────────────

function generateInvitationCode(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return code;
}
