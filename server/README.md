# Wedding Invitation Backend — SQLite + JWT Auth

Backend Express untuk sistem kode undangan aman dan check-in QR one-time-use. Menggunakan **SQLite** via `better-sqlite3` untuk performa tinggi dan mendukung 1000+ undangan dengan indexed queries.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Buka `.env` dan **wajib ganti** `JWT_SECRET`, `TOKEN_SECRET`, dan `ADMIN_KEY` dengan nilai rahasia unik.

Buat contoh undangan untuk testing:

```bash
npm run seed         # 4 undangan contoh
npm run seed:bulk    # 100+ undangan massal
```

Jalankan server:

```bash
npm run dev     # mode watch (Node 18+)
npm start       # production
```

Server berjalan di `http://localhost:4000`.

## API Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/health` | Publik | Status server |
| GET | `/api/invitation/:code` | Publik (rate-limited) | Lookup data tamu untuk halaman undangan |
| POST | `/api/invitation/generate` | Admin | Buat undangan baru |
| POST | `/api/invitation/generate-bulk` | Admin | Buat undangan massal (max 500/batch) |
| GET | `/api/invitation?page=&limit=&search=` | Admin | Daftar undangan dengan pagination & search |
| POST | `/api/checkin` | Admin | Validasi & proses check-in (QR token atau kode manual) |
| GET | `/api/dashboard/statistics` | Admin | Statistik ringkasan |
| GET | `/api/dashboard/history` | Admin | Riwayat scan (audit log) |
| POST | `/api/admin/login` | Publik (rate-limited) | Login admin, dapatkan JWT token |
| POST | `/api/rsvp` | Publik (rate-limited) | Submit RSVP |
| GET | `/api/rsvp` | Admin | List semua RSVP |
| POST | `/api/wishes` | Publik (rate-limited) | Submit ucapan/doa |
| GET | `/api/wishes?page=&limit=` | Publik | List ucapan (terbaru di atas) |
| GET | `/api/wishes/admin` | Admin | List semua ucapan |

## Authentication

**Dual-mode** — admin bisa menggunakan salah satu:

1. **JWT Token** (recommended): Login via `POST /api/admin/login` dengan body `{ adminKey }`, dapatkan token. Gunakan `Authorization: Bearer <token>` di header request.
2. **Direct key**: Kirim header `x-admin-key: <ADMIN_KEY>` langsung (backward-compatible).

JWT token expire setelah `JWT_EXPIRES_IN` (default 8 jam).

## Database

SQLite via `better-sqlite3` dengan **WAL mode** (Write-Ahead Logging) untuk performa concurrent read/write yang optimal.

- Data: `server/data/wedding.db` (auto-created saat pertama kali init)
- Backup: `npm run backup` → `server/data/backups/` (keep last 7)
- File `.gitignore` sudah mengabaikan file `.db`, `.db-wal`, `.db-shm`

### Schema

| Tabel | Fungsi |
|---|---|
| `invitations` | Data tamu, kode undangan, status check-in |
| `audit_logs` | Log setiap percobaan scan (berhasil, duplikat, invalid) |
| `rsvps` | Konfirmasi kehadiran dari tamu |
| `wishes` | Ucapan/doa dari tamu |

### Performance

- Indexed queries: `invitation_code`, `checked_in`, `created_at` (wishes)
- Check-in diproses dalam **satu transaksi SQLite** (lookup + update + audit log atomik)
- Statistik dihitung via **SQL aggregation** (`SUM`, `COUNT`), bukan JavaScript filter
- Audit log auto-pruned ke 5000 entri terakhir

## Rate Limiting

| Endpoint | Batas |
|---|---|
| Check-in | 120/menit/IP |
| Public lookup | 60/menit/IP |
| Admin login | 10/15 menit/IP |
| Public writes (RSVP, wishes) | 10/menit/IP |

## Deployment

**Butuh disk persisten** — tidak cocok untuk serverless (Vercel Functions). Cocok untuk:
- Railway, Render, Fly.io, VPS, atau hosting Node.js lainnya
- Jalankan `npm run backup` secara berkala atau set cron backup
- Set `CORS_ORIGIN` sesuai domain frontend produksi
- Jalankan di belakang HTTPS (reverse proxy / hosting dengan TLS)
