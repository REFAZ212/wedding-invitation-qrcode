import { Router } from "express";
import { findByCode, findById, processCheckIn, addAuditLog } from "../db.js";
import { verifyInvitationToken } from "../tokens.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { checkinRateLimiter } from "../middleware/rateLimiter.js";
import { logger } from "../logger.js";

export const checkinRouter = Router();

checkinRouter.post("/", requireAdminAuth, checkinRateLimiter, async (req, res) => {
  try {
    const { token, code, staffName } = req.body || {};
    let invitation = null;
    let scanMethod = null;

    if (token) {
      const invitationId = verifyInvitationToken(token);
      scanMethod = "qr_token";
      if (invitationId) {
        invitation = findById(invitationId);
      }
    } else if (code) {
      scanMethod = "manual_code";
      invitation = findByCode(code);
    } else {
      return res.status(400).json({ error: "token atau code wajib diisi." });
    }

    if (!invitation) {
      addAuditLog({ action: "scan_invalid", scanMethod, scannedBy: staffName || "Unknown", invitationCode: code || null });
      return res.status(404).json({ status: "invalid", message: "Invalid Invitation" });
    }

    if (invitation.checked_in) {
      addAuditLog({ action: "scan_duplicate", scanMethod, scannedBy: staffName || "Unknown", invitationCode: invitation.invitation_code });
      return res.status(409).json({
        status: "already_used",
        message: "Invitation has already been used.",
        guestName: invitation.guest_name,
        invitationCode: invitation.invitation_code,
        checkedInAt: invitation.checked_in_at,
        checkedInBy: invitation.checked_in_by,
      });
    }

    const updated = processCheckIn(invitation.id, staffName);

    if (updated.result === "success") {
      res.json({
        status: "success",
        message: "Allowed Entry",
        guestName: updated.invitation.guest_name,
        invitationCode: updated.invitation.invitation_code,
        maxGuests: updated.invitation.max_guests,
        checkedInAt: updated.invitation.checked_in_at,
      });
    } else {
      res.status(500).json({ status: "error", message: "Check-in processing failed." });
    }
  } catch (err) {
    logger.error("Error processing check-in", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});
