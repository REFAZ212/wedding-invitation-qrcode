import { useCallback, useEffect, useState } from "react";
import { adminLogin, ApiError } from "@/services/api";

const TOKEN_KEY = "wedding_admin_token";

interface UseAdminAuthResult {
  token: string | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  error: string | null;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

export function useAdminAuth(): UseAdminAuthResult {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    try {
      const result = await adminLogin(key);
      sessionStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Admin key tidak valid."
          : "Tidak dapat terhubung ke server.";
      setError(message);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  useEffect(() => {
    if (token) setError(null);
  }, [token]);

  return { token, isAuthenticated: !!token, isVerifying, error, login, logout };
}
