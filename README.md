# 💍 Premium Digital Wedding Invitation

Undangan pernikahan digital premium — dibangun dengan **React + TypeScript + Vite + Tailwind CSS + Framer Motion**. Elegan, responsif, dan sepenuhnya dapat dipersonalisasi hanya lewat satu file konfigurasi.

## ✨ Fitur

- **Sistem kode undangan aman**: setiap tamu punya kode acak unik (`/i/A8F3K9XZ`) yang di-lookup ke backend — nama tamu tidak pernah ada di URL
- **QR check-in one-time-use**: setiap undangan punya QR tiket masuk yang ditandatangani (HMAC), divalidasi & ditandai check-in sepenuhnya di server
- **Panel admin `/admin/checkin`**: scanner QR kamera + input manual kode, dengan animasi hasil sukses/duplikat/tidak-valid
- **Dashboard admin `/admin/dashboard`**: statistik real-time (total undangan, hadir, belum hadir, % kehadiran), chart, generate undangan baru, riwayat scan
- Opening screen dengan foto pasangan, nama tamu personalisasi (dari backend), dan musik yang **tidak autoplay**
- Floating music controller (play/pause, mute, animasi berputar)
- Navigasi bottom-floating (mobile) & sticky top (desktop) dengan indikator section aktif
- Hero + countdown timer realtime (hari/jam/menit/detik)
- Kartu pasangan mempelai + monogram penghubung
- Timeline Love Story beranimasi
- Detail acara (akad & resepsi) + Google Maps embed + tombol tambah ke kalender (.ics)
- Galeri foto masonry + lightbox swipe (Swiper.js) + lazy loading
- Slider "Our Moments" (coverflow) & video pre-wedding YouTube
- Form RSVP (React Hook Form) dengan animasi sukses
- Guest book / Wishes real-time (terbaru di atas)
- Wedding gift: kartu rekening bank + QRIS dengan tombol salin/unduh
- Amplop digital (alamat pengiriman kado fisik)
- Hashtag Instagram, catatan protokol acara
- Dark/Light mode, scroll progress bar, cursor glow, falling petals, confetti saat membuka undangan
- SEO ready (meta tags + Open Graph) & PWA ready

## 🏗️ Arsitektur

Project ini sekarang terdiri dari **dua bagian**:

```
wedding-invitation/          ← frontend (React + Vite, project ini)
wedding-invitation/server/   ← backend (Express + lowdb) — lihat server/README.md
```

Frontend TIDAK bisa menampilkan undangan tanpa backend berjalan, karena data tamu (nama, status check-in, QR token) diambil secara real-time dari API. Untuk detail lengkap backend (endpoint, model keamanan, cara generate undangan), baca **`server/README.md`**.

## 🚀 Menjalankan Secara Lokal

### 1. Jalankan backend terlebih dahulu

```bash
cd server
npm install
cp .env.example .env
# edit .env: ganti TOKEN_SECRET dan ADMIN_KEY dengan nilai rahasia Anda sendiri
npm run seed    # membuat beberapa contoh undangan untuk testing
npm run dev
```

Backend berjalan di `http://localhost:4000`. Catat salah satu **kode undangan** yang dicetak oleh `npm run seed` (mis. `A8F3K9XZ`) untuk mencoba halaman undangan.

### 2. Jalankan frontend

Di terminal terpisah, dari root folder project ini:

```bash
npm install
cp .env.example .env   # pastikan VITE_API_BASE_URL menunjuk ke backend (default sudah benar)
npm run dev
```

Buka:

- `http://localhost:5173/i/A8F3K9XZ` — halaman undangan tamu (ganti dengan kode hasil seed Anda)
- `http://localhost:5173/admin/checkin` — panel staff check-in (masukkan `ADMIN_KEY` dari `server/.env` saat diminta login)
- `http://localhost:5173/admin/dashboard` — statistik & manajemen undangan (generate kode baru dari sini)

Build untuk produksi:

```bash
npm run build
npm run preview
```

## 🎨 Kustomisasi Data (Tanpa Sentuh Kode Komponen)

Seluruh konten — nama mempelai, tanggal, foto, acara, galeri, rekening, dsb — diatur dari **satu file**:

```
src/data/config.ts
```

Ganti nilai-nilai di objek `weddingConfig` sesuai data pasangan Anda. Semua komponen akan otomatis mengikuti data baru ini.

### Mengganti Foto & Aset

Aset placeholder (dihasilkan otomatis) ada di `public/images/`, `public/audio/`, dan `public/og-cover.jpg`. Ganti file-file berikut dengan foto/lagu asli Anda (pertahankan nama filenya, atau ubah path-nya di `src/data/config.ts`):

| Aset | Lokasi |
|---|---|
| Foto mempelai wanita/pria | `public/images/bride.jpg`, `public/images/groom.jpg` |
| Foto cover & couple | `public/images/cover-bg.jpg`, `public/images/cover-couple.jpg` |
| Foto timeline | `public/images/timeline-1.jpg` … `timeline-4.jpg` |
| Galeri | `public/images/gallery-1.jpg` … `gallery-8.jpg` |
| Musik latar | `public/audio/wedding-song.mp3` (saat ini file bisu/silent — ganti dengan lagu asli) |
| QRIS | `public/images/qris-groom.png`, `public/images/qris-bride.png` |
| Logo bank | `public/images/bank-bca.svg`, `public/images/bank-mandiri.svg` |
| Open Graph image | `public/og-cover.jpg` |

### Mengganti Warna & Tipografi

Token desain (warna, font, animasi) ada di `tailwind.config.js` — ubah nilai di `theme.extend.colors` dan `theme.extend.fontFamily` untuk mengganti palet/tema tanpa menyentuh komponen.

## 📁 Struktur Folder

```
src/
├── assets/            # aset statis yang di-bundle
├── components/        # komponen per-fitur (Hero, Countdown, Couple, Timeline, Event, Gallery, RSVP, Wishes, Gift, Footer, Navigation, Cover, Loading, Admin, ...)
├── data/config.ts      # PUSAT KONFIGURASI konten undangan — edit di sini
├── hooks/              # custom hooks (countdown, audio, theme, toast, invitation, admin auth, dst)
├── pages/              # InvitationPage, InvitationNotFound, HomeRedirect, admin/AdminCheckin, admin/AdminDashboard
├── services/api.ts     # client API ke backend (invitation lookup, checkin, dashboard)
├── types/              # TypeScript types
├── utils/helpers.ts    # fungsi utilitas (copy, kalender, share)
├── styles/index.css    # global styles
└── App.tsx             # router utama (react-router-dom)

server/                 # backend Express + lowdb — lihat server/README.md
```

## 🧩 Menghubungkan RSVP/Wishes ke Backend Sungguhan

Saat ini `RSVP.tsx` dan `Wishes.tsx` menyimpan data secara lokal (in-memory) sebagai contoh — belum terhubung ke backend `server/`. Untuk produksi, ganti fungsi `onSubmit` di masing-masing komponen dengan pemanggilan API (bisa ditambahkan sebagai endpoint baru di `server/src/routes/`, mengikuti pola yang sama seperti `invitation.js`/`checkin.js`).

## 📦 Deploy

**Frontend** menghasilkan folder `dist/` statis lewat `npm run build` — bisa di-deploy ke Vercel, Netlify, Cloudflare Pages, atau hosting statis apa pun. Karena aplikasi kini multi-route (`/i/:code`, `/admin/checkin`, dst), pastikan hosting Anda melakukan **SPA fallback** (semua path diarahkan ke `index.html`):

- Netlify: sudah disediakan `public/_redirects`
- Vercel: sudah disediakan `vercel.json`
- Hosting lain: konfigurasikan rewrite rule serupa

Set juga environment variable `VITE_API_BASE_URL` di platform hosting Anda agar menunjuk ke URL backend produksi.

**Backend** (`server/`) perlu di-deploy terpisah ke platform yang mendukung proses Node.js long-running dengan disk persisten (Railway, Render, Fly.io, VPS) — lihat `server/README.md` untuk detail lengkap, termasuk model keamanan dan catatan skalabilitas.

---

Dibangun dengan ❤️ menggunakan React, TypeScript, Tailwind CSS, Framer Motion, dan Express.
