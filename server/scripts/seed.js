import "dotenv/config";
import { initDb, createInvitation } from "../src/db.js";
import { signInvitationToken } from "../src/tokens.js";

const SAMPLE_GUESTS = [
  { guestName: "Budi Santoso", maxGuests: 2 },
  { guestName: "Sarah & Kevin", maxGuests: 2 },
  { guestName: "Dewi Lestari", maxGuests: 1 },
  { guestName: "Keluarga Bapak Hendra", maxGuests: 4 },
];

async function main() {
  await initDb();
  console.log("Membuat contoh undangan...\n");

  for (const guest of SAMPLE_GUESTS) {
    const invitation = await createInvitation(guest);
    const qrToken = signInvitationToken(invitation.id);
    console.log(`• ${invitation.guestName}`);
    console.log(`  Kode undangan : ${invitation.invitationCode}`);
    console.log(`  URL undangan  : /i/${invitation.invitationCode}`);
    console.log(`  QR Token      : ${qrToken}`);
    console.log("");
  }

  console.log("Selesai. Gunakan salah satu kode/QR di atas untuk mencoba flow undangan & check-in.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
