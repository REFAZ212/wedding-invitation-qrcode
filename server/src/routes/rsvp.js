import { Router } from "express";
import { createRsvp, listRsvps } from "../db.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { publicWriteRateLimiter } from "../middleware/rateLimiter.js";
import { logger } from "../logger.js";

export const rsvpRouter = Router();

rsvpRouter.post("/", publicWriteRateLimiter, async (req, res) => {
  try {
    const { name, phone, guests, attendance, message, invitationCode } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Nama wajib diisi." });
    }
    if (!attendance || !["attending", "not_attending"].includes(attendance)) {
      return res.status(400).json({ error: "Kehadiran wajib diisi (attending/not_attending)." });
    }
    const parsedGuests = Number.isFinite(Number(guests)) ? Number(guests) : 1;
    if (parsedGuests < 1 || parsedGuests > 20) {
      return res.status(400).json({ error: "Jumlah tamu harus antara 1-20." });
    }
    const rsvp = createRsvp({
      name: name.trim(),
      phone: phone || null,
      guests: parsedGuests,
      attendance,
      message: message || null,
      invitationCode: invitationCode || null,
    });
    logger.info("RSVP received", { name: name.trim(), attendance });
    res.status(201).json(rsvp);
  } catch (err) {
    logger.error("Error creating RSVP", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

rsvpRouter.get("/", requireAdminAuth, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const result = listRsvps({ page, limit });
    res.json(result);
  } catch (err) {
    logger.error("Error listing RSVPs", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});
