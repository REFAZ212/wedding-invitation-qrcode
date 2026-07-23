import { Router } from "express";
import { findByCode, findById, markCheckedIn, incrementScanCount, addAuditLog } from "../db.js";
import { verifyInvitationToken } from "../tokens.js";
import { requireAdminKey } from "../middleware/adminAuth.js";
import { checkinRateLimiter } from "../middleware/rateLimiter.js";

export const checkinRouter = Router();

/**
 * POST /api/checkin
 * Endpoint ADMIN/STAFF untuk memvalidasi & memproses check-in tamu.
 *
 * Body salah satu dari:
 *   { token: string }   — hasil scan QR (jalur utama & paling aman)
 *   { code: string }    — input manual kode undangan oleh staff (fallback)
 *
 * Juga menerima { staffName?: string } untuk audit trail "checked_in_by".
 *
 * PENTING: seluruh keputusan valid/tidak valid/sudah-terpakai dihitung di backend.
 * Frontend tidak pernah dipercaya untuk menentukan status check-in.
 */
checkinRouter.post("/", requireAdminKey, checkinRateLimiter, async (req, res) => {
  const { token, code, staffName } = req.body || {};

  let invitation = null;
  let scanMethod = null;

  if (token) {
    const invitationId = verifyInvitationToken(token);
    scanMethod = "qr_token";
    if (invitationId) {
      invitation = await findById(invitationId);
    }
  } else if (code) {
    scanMethod = "manual_code";
    invitation = await findByCode(code);
  } else {
    return res.status(400).json({ error: "token atau code wajib diisi." });
  }

  if (!invitation) {
    await addAuditLog({
      action: "scan_invalid",
      scanMethod,
      scannedBy: staffName || "Unknown",
      invitationCode: code || null,
    });
    return res.status(404).json({ status: "invalid", message: "Invalid Invitation" });
  }

  await incrementScanCount(invitation.id);

  if (invitation.checkedIn) {
    await addAuditLog({
      action: "scan_duplicate",
      scanMethod,
      scannedBy: staffName || "Unknown",
      invitationCode: invitation.invitationCode,
    });
    return res.status(409).json({
      status: "already_used",
      message: "Invitation has already been used.",
      guestName: invitation.guestName,
      invitationCode: invitation.invitationCode,
      checkedInAt: invitation.checkedInAt,
      checkedInBy: invitation.checkedInBy,
    });
  }

  const updated = await markCheckedIn(invitation.id, staffName);

  await addAuditLog({
    action: "scan_success",
    scanMethod,
    scannedBy: staffName || "Unknown",
    invitationCode: invitation.invitationCode,
  });

  res.json({
    status: "success",
    message: "Allowed Entry",
    guestName: updated.guestName,
    invitationCode: updated.invitationCode,
    maxGuests: updated.maxGuests,
    checkedInAt: updated.checkedInAt,
  });
});
