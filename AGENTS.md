# AGENTS.md

## Project overview

Two-part wedding invitation app: a **React + Vite frontend** (root) and an **Express + SQLite backend** (`server/`). The frontend cannot function without the backend running — guest data, QR check-in validation, RSVP, wishes, and dashboard stats all come from the API.

## Quick start (two terminals)

**Backend first:**
```bash
cd server && npm install && cp .env.example .env && npm run seed && npm run dev
```
Server runs on `http://localhost:4000`. Seed prints invitation codes to use in the frontend.

**Frontend second (separate terminal):**
```bash
npm install && cp .env.example .env && npm run dev
```
Frontend runs on `http://localhost:5173`. Visit `/i/<CODE>` with a code from seed output.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | `tsc -b && vite build` — typecheck then bundle to `dist/` |
| `npm run lint` | ESLint (flat config, `.ts`/`.tsx` only) |
| `npm run preview` | Serve production build locally |
| `cd server && npm run dev` | Express server with `--watch` (port 4000) |
| `cd server && npm run seed` | Seed 4 sample invitations |
| `cd server && npm run seed:bulk` | Seed 100+ bulk invitations |
| `cd server && npm start` | Express server without watch mode |
| `cd server && npm run backup` | Backup SQLite DB (keeps last 7) |

There is **no test suite**. Verification = `lint` then `build`.

## Architecture

- **`src/data/config.ts`** — single source of truth for all wedding content (names, dates, photos, events, bank accounts, etc.). All components read from here.
- **`src/App.tsx`** — router. Routes: `/i/:code` (guest), `/admin/checkin`, `/admin/dashboard`.
- **`server/src/db.js`** — SQLite layer via `better-sqlite3`. WAL mode enabled. All queries are synchronous (no async overhead). Data lives in `server/data/wedding.db`.
- **`server/src/tokens.js`** — HMAC-SHA256 QR token signing. Zero DB dependencies.
- Admin pages are **lazy-loaded** (`html5-qrcode` and `recharts` are heavy).

## Key conventions

- **Path alias:** `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
- **Strict TS:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are all enabled. Build will fail on violations.
- **No autoplay music:** Audio is user-triggered only. Don't add `autoPlay` attributes.
- **RSVP and Wishes are connected to backend** — data persists in SQLite. Endpoints: `POST/GET /api/rsvp`, `POST/GET /api/wishes`.
- **PWA enabled** via `vite-plugin-pwa` with auto-update. Icons expected at `public/icon-192.png` and `public/icon-512.png`.
- **Design tokens** live in `tailwind.config.js` (`theme.extend.colors`, `theme.extend.fontFamily`). Colors: gold `#C9A24B`, ivory `#FBF7F0`.
- **Vercel SPA rewrite** already configured in `vercel.json` — all paths rewrite to `index.html`.

## Backend specifics

- **Database:** SQLite via `better-sqlite3` with WAL mode. Handles 1000+ invitations with indexed queries and SQL aggregation. `initDb()` creates tables on first run.
- **Auth:** Dual-mode — admin can send `x-admin-key` header directly OR login via `POST /api/admin/login` to receive a JWT token (`Authorization: Bearer <token>`). JWT expires after `JWT_EXPIRES_IN` (default 8h).
- **QR tokens:** HMAC-SHA256 signed — invalid if `TOKEN_SECRET` is changed after generation.
- **Check-in:** One-time-use, validated in a single SQLite transaction. Duplicate scans return `already_used`.
- **Bulk operations:** `POST /api/invitation/generate-bulk` accepts up to 500 guests per request (wrapped in a transaction).
- **Pagination:** Invitation list supports `?page=&limit=&search=` query params.
- **Rate limiting:** 120/min check-in, 60/min lookup, 10/min auth, 10/min public writes.
- **Structured logging:** `server/src/logger.js` — timestamps, levels, JSON metadata. Set `LOG_LEVEL=debug` for verbose output.
- **Backup:** `npm run backup` copies SQLite DB to `data/backups/`, keeps last 7.
- **Not suitable for serverless** — needs persistent disk for SQLite file.

## Gotchas

- `.env` at root sets `VITE_API_BASE_URL` — defaults to `http://localhost:4000` in `.env.example`.
- `server/.env` needs `JWT_SECRET`, `TOKEN_SECRET`, `ADMIN_KEY`, and `CORS_ORIGIN` all set to unique random values in production.
- `better-sqlite3` is a native module — requires `node-gyp` build tools on first `npm install`. Works out of the box on most systems; Windows may need Visual Studio Build Tools.
- ESLint ignores `dist/`. No formatter (Prettier, etc.) is configured.
- Windows: `server/` uses `node --watch` for dev (works on Node 18+ on Windows).
- The `@/` alias only works in Vite-processed code, not in raw Node scripts.
- The old `db.json` (lowdb) is no longer used. The database is now `data/wedding.db` (SQLite).
