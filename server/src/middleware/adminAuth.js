import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAdminAuth(req, res, next) {
  const authHeader = req.header("Authorization");
  const providedKey = req.header("x-admin-key");
  const expectedKey = process.env.ADMIN_KEY;

  if (providedKey && expectedKey && providedKey === expectedKey) {
    req.admin = { role: "admin", loginMethod: "key" };
    return next();
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (decoded) {
      req.admin = decoded;
      return next();
    }
  }

  return res.status(401).json({ error: "Unauthorized. Silakan login kembali." });
}

export function requireAdminLogin(req, res) {
  const { adminKey } = req.body || {};
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    return res.status(500).json({ error: "Server belum dikonfigurasi." });
  }

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({ error: "Admin key tidak valid." });
  }

  const token = generateToken({ role: "admin", loginMethod: "key" });
  res.json({ token, expiresIn: JWT_EXPIRES_IN });
}
