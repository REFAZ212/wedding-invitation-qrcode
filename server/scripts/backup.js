import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "wedding.db");
const BACKUP_DIR = path.join(__dirname, "..", "data", "backups");

function backup() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("Database file not found:", DB_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `wedding-${timestamp}.db`);
  fs.copyFileSync(DB_PATH, backupFile);
  const walPath = DB_PATH + "-wal";
  const shmPath = DB_PATH + "-shm";
  if (fs.existsSync(walPath)) fs.copyFileSync(walPath, backupFile + "-wal");
  if (fs.existsSync(shmPath)) fs.copyFileSync(shmPath, backupFile + "-shm");
  console.log(`Backup created: ${backupFile}`);
  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".db")).sort();
  if (files.length > 7) {
    for (const old of files.slice(0, files.length - 7)) {
      fs.unlinkSync(path.join(BACKUP_DIR, old));
      fs.unlinkSync(path.join(BACKUP_DIR, old + "-wal")).catch?.();
      fs.unlinkSync(path.join(BACKUP_DIR, old + "-shm")).catch?.();
    }
    console.log(`Cleaned up old backups (kept last 7)`);
  }
}

backup();
