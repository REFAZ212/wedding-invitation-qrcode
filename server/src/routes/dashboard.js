import { Router } from "express";
import { getStatistics, listAuditLogs } from "../db.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { logger } from "../logger.js";

export const dashboardRouter = Router();

dashboardRouter.get("/statistics", requireAdminAuth, async (_req, res) => {
  try {
    const stats = getStatistics();
    res.json(stats);
  } catch (err) {
    logger.error("Error fetching statistics", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

dashboardRouter.get("/history", requireAdminAuth, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 500);
    const logs = listAuditLogs(limit);
    res.json({ logs });
  } catch (err) {
    logger.error("Error fetching audit logs", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});
