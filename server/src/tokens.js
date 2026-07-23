import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.TOKEN_SECRET || "insecure-default-secret-change-me";

/**
 * Membuat token QR yang aman untuk sebuah invitation id.
 * Format: <id-base64url>.<signatureHex>
 * Token TIDAK mengandung nama tamu maupun informasi tamu lain — hanya id internal
 * yang ditandatangani, sehingga tidak bisa dipalsukan tanpa mengetahui TOKEN_SECRET.
 */
export function signInvitationToken(invitationId) {
  const payload = Buffer.from(invitationId, "utf8").toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/**
 * Memverifikasi token QR. Mengembalikan invitationId bila valid, atau null bila
 * token rusak/dipalsukan/tidak valid.
 */
export function verifyInvitationToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");

  // Perbandingan waktu-konstan untuk mencegah timing attack
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function sign(payload) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}
