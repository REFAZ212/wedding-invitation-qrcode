import { Navigate, useSearchParams } from "react-router-dom";
import InvitationNotFound from "@/pages/InvitationNotFound";

/**
 * Menangani akses ke "/" atau "/invite".
 * Mendukung kompatibilitas mundur berupa query string `?code=XXXXXXXX`
 * (mis. tautan lama berformat /invite?code=A8F3K9XZ), lalu mengarahkan
 * ke rute kanonik /i/:code. Bila tidak ada kode sama sekali, tampilkan
 * pesan yang meminta tamu membuka tautan pribadi mereka.
 */
export default function HomeRedirect() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  if (code && code.trim()) {
    return <Navigate to={`/i/${encodeURIComponent(code.trim())}`} replace />;
  }

  return <InvitationNotFound variant="missing" />;
}
