import rateLimit from "express-rate-limit";

/** Membatasi percobaan validasi check-in — mencegah brute-force menebak kode undangan. */
export const checkinRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 60, // maksimum 60 percobaan scan per menit per IP (cukup untuk beberapa staff sekaligus)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan. Silakan coba lagi sebentar lagi." },
});

/** Membatasi akses endpoint publik pencarian invitation-by-code agar tidak disalahgunakan untuk enumerasi. */
export const invitationLookupRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak permintaan. Silakan coba lagi sebentar lagi." },
});
