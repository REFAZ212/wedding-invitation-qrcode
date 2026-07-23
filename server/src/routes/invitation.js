import { Router } from "express";
import { createInvitation, createInvitationsBulk, findByCode, listInvitations } from "../db.js";
import { signInvitationToken } from "../tokens.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { invitationLookupRateLimiter } from "../middleware/rateLimiter.js";
import { logger } from "../logger.js";

export const invitationRouter = Router();

invitationRouter.get("/:code", invitationLookupRateLimiter, async (req, res) => {
  try {
    const invitation = findByCode(req.params.code);
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }
    res.json({
      guestName: invitation.guest_name,
      maxGuests: invitation.max_guests,
      checkedIn: !!invitation.checked_in,
      invitationCode: invitation.invitation_code,
      qrToken: signInvitationToken(invitation.id),
    });
  } catch (err) {
    logger.error("Error fetching invitation", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

invitationRouter.post("/generate", requireAdminAuth, async (req, res) => {
  try {
    const { guestName, maxGuests } = req.body || {};
    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      return res.status(400).json({ error: "guestName wajib diisi." });
    }
    const parsedMaxGuests = Number.isFinite(Number(maxGuests)) ? Number(maxGuests) : 2;
    if (parsedMaxGuests < 1 || parsedMaxGuests > 20) {
      return res.status(400).json({ error: "maxGuests harus antara 1-20." });
    }
    const invitation = createInvitation({ guestName: guestName.trim(), maxGuests: parsedMaxGuests });
    logger.info("Invitation created", { guestName: guestName.trim(), code: invitation.invitation_code });
    res.status(201).json({
      id: invitation.id,
      guestName: invitation.guest_name,
      invitationCode: invitation.invitation_code,
      maxGuests: invitation.max_guests,
      checkedIn: !!invitation.checked_in,
      checkedInAt: invitation.checked_in_at,
      checkedInBy: invitation.checked_in_by,
      scanCount: invitation.scan_count,
      createdAt: invitation.created_at,
      updatedAt: invitation.updated_at,
      qrToken: signInvitationToken(invitation.id),
      invitationUrl: `/i/${invitation.invitation_code}`,
    });
  } catch (err) {
    logger.error("Error generating invitation", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

invitationRouter.post("/generate-bulk", requireAdminAuth, async (req, res) => {
  try {
    const { guests } = req.body || {};
    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ error: "guests harus berupa array dengan minimal 1 tamu." });
    }
    if (guests.length > 500) {
      return res.status(400).json({ error: "Maksimal 500 undangan per batch." });
    }
    for (const g of guests) {
      if (!g.guestName || typeof g.guestName !== "string" || !g.guestName.trim()) {
        return res.status(400).json({ error: "Setiap tamu wajib memiliki guestName." });
      }
    }
    const validGuests = guests.map((g) => ({
      guestName: g.guestName.trim(),
      maxGuests: Number.isFinite(Number(g.maxGuests)) ? Number(g.maxGuests) : 2,
    }));
    const results = createInvitationsBulk(validGuests);
    logger.info("Bulk invitations created", { count: results.length });
    res.status(201).json({ count: results.length, invitations: results });
  } catch (err) {
    logger.error("Error bulk generating invitations", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

invitationRouter.get("/", requireAdminAuth, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const search = String(req.query.search || "");
    const result = listInvitations({ page, limit, search });
    res.json({
      invitations: result.invitations.map((inv) => ({
        id: inv.id,
        guestName: inv.guest_name,
        invitationCode: inv.invitation_code,
        maxGuests: inv.max_guests,
        checkedIn: !!inv.checked_in,
        checkedInAt: inv.checked_in_at,
        checkedInBy: inv.checked_in_by,
        scanCount: inv.scan_count,
        createdAt: inv.created_at,
        updatedAt: inv.updated_at,
      })),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (err) {
    logger.error("Error listing invitations", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});
