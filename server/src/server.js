import "dotenv/config";
import express from "express";
import cors from "cors";

import { initDb, closeDb } from "./db.js";
import { logger } from "./logger.js";
import { requireAdminLogin } from "./middleware/adminAuth.js";
import { authRateLimiter } from "./middleware/rateLimiter.js";
import { invitationRouter } from "./routes/invitation.js";
import { checkinRouter } from "./routes/checkin.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { rsvpRouter } from "./routes/rsvp.js";
import { wishesRouter } from "./routes/wishes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.post("/api/admin/login", authRateLimiter, requireAdminLogin);

app.use("/api/invitation", invitationRouter);
app.use("/api/checkin", checkinRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/rsvp", rsvpRouter);
app.use("/api/wishes", wishesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { path: req.path, error: err.message });
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
});

async function start() {
  initDb();
  logger.info("Database SQLite initialized", { path: "data/wedding.db" });

  const server = app.listen(PORT, () => {
    logger.info(`Wedding invitation API running on http://localhost:${PORT}`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down...`);
    server.close(() => {
      closeDb();
      logger.info("Server stopped");
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 5000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  logger.error("Failed to start server", { error: err.message });
  process.exit(1);
});
