import "dotenv/config";
import { initDb, createInvitation, createInvitationsBulk } from "../src/db.js";
import { signInvitationToken } from "../src/tokens.js";
import { logger } from "../src/logger.js";

const SAMPLE_GUESTS = [
  { guestName: "Budi Santoso", maxGuests: 2 },
  { guestName: "Sarah & Kevin", maxGuests: 2 },
  { guestName: "Dewi Lestari", maxGuests: 1 },
  { guestName: "Keluarga Bapak Hendra", maxGuests: 4 },
];

const BULK_NAMES = [
  "Ahmad Fauzi", "Rina Sari", "Dedi Kurniawan", "Maya Putri", "Rizky Pratama",
  "Anisa Rahmawati", "Fajar Nugroho", "Lestari Anggraeni", "Hendra Wijaya", "Siti Nurhaliza",
  "Bambang Pamungkas", "Ratna Dewi", "Indra Gunawan", "Putri Maharani", "Andi Saputra",
  "Dwi Rahayu", "Candra Firmansyah", "Wulan Sari", "Tommy Hermawan", "Vera Octavia",
];

async function main() {
  const isBulk = process.argv.includes("--bulk");
  const count = isBulk ? Number(process.argv[process.argv.indexOf("--bulk") + 1]) || 100 : 0;

  initDb();
  logger.info("Creating sample invitations...");

  for (const guest of SAMPLE_GUESTS) {
    const invitation = createInvitation(guest);
    const qrToken = signInvitationToken(invitation.id);
    console.log(`  ${invitation.guest_name} -> /i/${invitation.invitation_code} (QR: ${qrToken})`);
  }

  if (isBulk && count > 0) {
    logger.info(`Bulk creating ${count} invitations...`);
    const guests = [];
    for (let i = 0; i < count; i++) {
      const name = BULK_NAMES[i % BULK_NAMES.length];
      guests.push({ guestName: `${name} #${i + 1}`, maxGuests: Math.ceil(Math.random() * 4) });
    }
    const results = createInvitationsBulk(guests);
    console.log(`  Created ${results.length} bulk invitations`);
    console.log(`  First: /i/${results[0].invitation_code}`);
    console.log(`  Last:  /i/${results[results.length - 1].invitation_code}`);
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
