# 🔐 Wedding Invitation Backend — Secure Invite & QR Check-In API

Backend Express untuk sistem kode undangan aman dan check-in QR one-time-use. Menggunakan **lowdb** (database JSON file, tanpa native module) agar mudah dijalankan di semua OS termasuk Windows tanpa perlu meng-compile dependency native.

## 🚀 Menjalankan

```bash
cd server
npm install
cp .env.example .env
```

Buka `.env` dan **wajib ganti** `TOKEN_SECRET` dan `ADMIN_KEY` dengan string acak & rahasia (jangan pakai nilai contoh saat produksi).

Buat beberapa contoh undangan untuk testing:

```bash
npm run seed
```

Jalankan server:

```bash
npm run dev     # mode watch, auto-restart saat file berubah
# atau
npm start
```

Server berjalan di `http://localhost:4000` (bisa diubah lewat `PORT` di `.env`).

Frontend (folder induk project ini) perlu tahu alamat backend ini lewat `VITE_API_BASE_URL` di file `.env` frontend (lihat `.env.example` di root project).

## 📡 API Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/health` | Publik | Cek server hidup |
| GET | `/api/invitation/:code` | Publik (rate-limited) | Ambil data tamu untuk ditampilkan di halaman undangan |
| POST | `/api/invitation/generate` | Admin | Buat undangan baru untuk seorang tamu |
| GET | `/api/invitation` | Admin | Daftar seluruh undangan |
| POST | `/api/checkin` | Admin | Validasi & proses check-in (via QR token atau kode manual) |
| GET | `/api/dashboard/statistics` | Admin | Statistik ringkasan kehadiran |
| GET | `/api/dashboard/history` | Admin | Riwayat scan (audit log) |

Endpoint **Admin** mewajibkan header `x-admin-key: <ADMIN_KEY dari .env>`.

### Contoh: membuat undangan baru

```bash
curl -X POST http://localhost:4000/api/invitation/generate \
  -H "Content-Type: application/json" \
  -H "x-admin-key: <ADMIN_KEY_ANDA>" \
  -d '{"guestName": "Budi Santoso", "maxGuests": 2}'
```

Response berisi `invitationCode` (untuk link `/i/KODE`) dan `qrToken` (untuk QR tiket masuk).

## 🔒 Model Keamanan

- **Kode undangan** (`invitationCode`): 8 karakter acak dari alphabet 32 simbol (tanpa karakter ambigu 0/O/1/I) → ±1 triliun kemungkinan. Dipakai sebagai identifier di URL (`/i/KODE`) — cukup acak untuk tidak bisa ditebak, namun tidak mengekspos nama tamu di URL.
- **QR token** (`qrToken`): payload id internal yang **ditandatangani HMAC-SHA256** dengan `TOKEN_SECRET`. Tidak bisa dipalsukan tanpa mengetahui secret ini. Ini yang di-encode ke QR "tiket masuk" — terpisah dari kode undangan yang dibagikan lewat link.
- **One-time check-in**: status `checkedIn` disimpan di server dan diperiksa atomically sebelum ditandai — percobaan scan kedua kali akan selalu mendapat `already_used`, tidak peduli dari device/token mana pun.
- **Rate limiting**: endpoint lookup publik dan check-in dibatasi per-IP untuk mencegah brute-force/enumerasi.
- **Audit log**: setiap percobaan scan (berhasil, duplikat, atau tidak valid) dicatat dengan waktu, metode, dan siapa yang melakukan scan.
- **Tidak ada data sensitif di frontend**: keputusan valid/tidak valid/sudah dipakai 100% dihitung di backend. Frontend hanya menampilkan hasil yang dikembalikan server.
- **Admin key**: pengamanan minimal berbasis shared-secret, cocok untuk skala event pernikahan (segelintir staff, durasi singkat). *Untuk kebutuhan lebih besar/berulang, ganti dengan sistem login staff sungguhan (JWT per-user + role-based access + hashed password).*

## 🗄️ Struktur Data

Disimpan di `server/data/db.json` (dibuat otomatis saat pertama kali `initDb()` dipanggil):

```
invitations: [
  {
    id, guestName, invitationCode, maxGuests,
    checkedIn, checkedInAt, checkedInBy, scanCount,
    createdAt, updatedAt
  }
]
auditLogs: [
  { id, timestamp, action, scanMethod, scannedBy, invitationCode }
]
```

## ☁️ Catatan Deployment

- File `data/db.json` butuh **disk yang persisten**. Cocok untuk hosting seperti Railway, Render, Fly.io, atau VPS biasa. **Tidak cocok** untuk platform serverless stateless (mis. Vercel Functions) tanpa volume storage terpisah, karena filesystem-nya akan direset setiap invocation.
- Untuk beban tamu sangat besar (ribuan undangan, banyak staff check-in bersamaan), pertimbangkan migrasi dari lowdb ke database sungguhan (PostgreSQL/MySQL) — struktur fungsi di `src/db.js` sudah dipisah rapi agar mudah diganti implementasinya tanpa menyentuh route.
- Set `CORS_ORIGIN` di `.env` sesuai domain frontend produksi Anda.
- Jalankan di belakang HTTPS (reverse proxy/hosting yang menyediakan TLS) — jangan expose admin key lewat koneksi HTTP biasa.
