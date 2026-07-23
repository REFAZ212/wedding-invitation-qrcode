import { useEffect, useState } from "react";
import { fetchInvitationByCode, ApiError, type InvitationPublicData } from "@/services/api";

interface UseInvitationResult {
  invitation: InvitationPublicData | null;
  loading: boolean;
  notFound: boolean;
  error: string | null;
}

/**
 * Mengambil data tamu dari backend berdasarkan kode undangan di URL.
 * Nama tamu TIDAK PERNAH diambil dari URL secara langsung — hanya kode
 * acak yang di-lookup ke server, dan server yang mengembalikan nama tamu.
 */
export function useInvitation(code: string | undefined): UseInvitationResult {
  const [invitation, setInvitation] = useState<InvitationPublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!code) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);
    setError(null);

    fetchInvitationByCode(code)
      .then((data) => {
        if (cancelled) return;
        setInvitation(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError("Tidak dapat terhubung ke server. Silakan coba lagi.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return { invitation, loading, notFound, error };
}
