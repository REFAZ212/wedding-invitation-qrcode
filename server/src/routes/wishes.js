import { Router } from "express";
import { createWish, listWishes } from "../db.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { publicWriteRateLimiter } from "../middleware/rateLimiter.js";
import { logger } from "../logger.js";

export const wishesRouter = Router();

wishesRouter.post("/", publicWriteRateLimiter, async (req, res) => {
  try {
    const { name, message, attendance } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Nama wajib diisi." });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Ucapan wajib diisi." });
    }
    const wish = createWish({
      name: name.trim(),
      message: message.trim(),
      attendance: attendance || "pending",
    });
    logger.info("Wish received", { name: name.trim() });
    res.status(201).json(wish);
  } catch (err) {
    logger.error("Error creating wish", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

wishesRouter.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const result = listWishes({ page, limit });
    res.json({
      wishes: result.wishes.map((w) => ({
        id: w.id,
        name: w.guest_name,
        message: w.message,
        attendance: w.attendance,
        createdAt: w.created_at,
      })),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (err) {
    logger.error("Error listing wishes", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

wishesRouter.get("/admin", requireAdminAuth, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const result = listWishes({ page, limit });
    res.json(result);
  } catch (err) {
    logger.error("Error listing wishes (admin)", { error: err.message });
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});
