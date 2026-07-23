import "dotenv/config";
import express from "express";
import cors from "cors";

import { initDb } from "./db.js";
import { invitationRouter } from "./routes/invitation.js";
import { checkinRouter } from "./routes/checkin.js";
import { dashboardRouter } from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "100kb" }));

// Header keamanan dasar (setara helmet minimal, tanpa dependency tambahan)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/invitation", invitationRouter);
app.use("/api/checkin", checkinRouter);
app.use("/api/dashboard", dashboardRouter);

// 404 handler generik — tidak membocorkan detail internal
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler generik
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
});

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`✔ Wedding invitation API berjalan di http://localhost:${PORT}`);
    console.log(`  Pastikan TOKEN_SECRET dan ADMIN_KEY sudah diganti dari nilai default di .env`);
  });
}

start();
