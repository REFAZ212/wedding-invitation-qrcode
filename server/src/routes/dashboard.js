import { Router } from "express";
import { getStatistics, listAuditLogs } from "../db.js";
import { requireAdminKey } from "../middleware/adminAuth.js";

export const dashboardRouter = Router();

/** GET /api/dashboard/statistics — ringkasan angka untuk kartu statistik dashboard. */
dashboardRouter.get("/statistics", requireAdminKey, async (_req, res) => {
  const stats = await getStatistics();
  res.json(stats);
});

/** GET /api/dashboard/history — riwayat scan (audit log) terbaru. */
dashboardRouter.get("/history", requireAdminKey, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 500);
  const logs = await listAuditLogs(limit);
  res.json({ logs });
});
