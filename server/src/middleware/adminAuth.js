/**
 * Middleware otentikasi untuk endpoint admin/staff.
 * Mengharuskan header `x-admin-key` cocok dengan ADMIN_KEY di environment.
 *
 * CATATAN PRODUKSI: ini adalah pengamanan minimal untuk skala acara pernikahan
 * (jumlah staff kecil, durasi pendek). Untuk kebutuhan yang lebih besar/lama,
 * ganti dengan sistem login staff sungguhan (JWT per-user + role-based access).
 */
export function requireAdminKey(req, res, next) {
  const providedKey = req.header("x-admin-key");
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    return res.status(500).json({ error: "Server belum dikonfigurasi (ADMIN_KEY tidak diset)." });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized. Admin key tidak valid." });
  }

  next();
}
