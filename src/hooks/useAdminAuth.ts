import { useCallback, useEffect, useState } from "react";
import { verifyAdminKey, ApiError } from "@/services/api";

const STORAGE_KEY = "wedding_admin_key";

interface UseAdminAuthResult {
  adminKey: string | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  error: string | null;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

/**
 * Mengelola sesi admin/staff check-in.
 * Admin key TIDAK di-hardcode di source/env frontend — staff memasukkannya secara
 * manual saat login, lalu disimpan hanya di sessionStorage (hilang saat tab ditutup).
 */
export function useAdminAuth(): UseAdminAuthResult {
  const [adminKey, setAdminKey] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    try {
      await verifyAdminKey(key);
      sessionStorage.setItem(STORAGE_KEY, key);
      setAdminKey(key);
      return true;
    } catch (err) {
      const message = err instanceof ApiError && err.status === 401
        ? "Admin key tidak valid."
        : "Tidak dapat terhubung ke server.";
      setError(message);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
  }, []);

  useEffect(() => {
    if (adminKey) setError(null);
  }, [adminKey]);

  return { adminKey, isAuthenticated: !!adminKey, isVerifying, error, login, logout };
}
