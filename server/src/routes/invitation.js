import { Router } from "express";
import { createInvitation, findByCode, listInvitations } from "../db.js";
import { signInvitationToken } from "../tokens.js";
import { requireAdminKey } from "../middleware/adminAuth.js";
import { invitationLookupRateLimiter } from "../middleware/rateLimiter.js";

export const invitationRouter = Router();

/**
 * GET /api/invitation/:code
 * Endpoint PUBLIK yang dibuka halaman undangan tamu.
 * Hanya mengembalikan data yang aman ditampilkan ke tamu ybs — tidak pernah
 * mengekspos daftar tamu lain maupun field internal (id, qrToken mentah, dsb).
 */
invitationRouter.get("/:code", invitationLookupRateLimiter, async (req, res) => {
  const invitation = await findByCode(req.params.code);

  if (!invitation) {
    // Respons generik — tidak membocorkan apakah kode "hampir benar" dsb.
    return res.status(404).json({ error: "Invitation not found" });
  }

  res.json({
    guestName: invitation.guestName,
    maxGuests: invitation.maxGuests,
    checkedIn: invitation.checkedIn,
    invitationCode: invitation.invitationCode,
    // Token QR dibuat on-demand dari id internal — tidak disimpan sebagai field terpisah,
    // sehingga TOKEN_SECRET tetap satu-satunya sumber keabsahan token.
    qrToken: signInvitationToken(invitation.id),
  });
});

/**
 * POST /api/invitation/generate
 * Endpoint ADMIN untuk membuat undangan baru bagi seorang tamu.
 * Body: { guestName: string, maxGuests?: number }
 */
invitationRouter.post("/generate", requireAdminKey, async (req, res) => {
  const { guestName, maxGuests } = req.body || {};

  if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
    return res.status(400).json({ error: "guestName wajib diisi." });
  }

  const parsedMaxGuests = Number.isFinite(Number(maxGuests)) ? Number(maxGuests) : 2;
  if (parsedMaxGuests < 1 || parsedMaxGuests > 20) {
    return res.status(400).json({ error: "maxGuests harus antara 1-20." });
  }

  const invitation = await createInvitation({ guestName: guestName.trim(), maxGuests: parsedMaxGuests });

  res.status(201).json({
    ...invitation,
    qrToken: signInvitationToken(invitation.id),
    invitationUrl: `/i/${invitation.invitationCode}`,
  });
});

/**
 * GET /api/invitation
 * Endpoint ADMIN untuk melihat seluruh daftar undangan (dashboard/manajemen tamu).
 */
invitationRouter.get("/", requireAdminKey, async (_req, res) => {
  const invitations = await listInvitations();
  res.json({ invitations });
});
