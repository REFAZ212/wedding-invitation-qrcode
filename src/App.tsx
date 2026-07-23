import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/hooks/useToast";

import HomeRedirect from "@/pages/HomeRedirect";
import InvitationPage from "@/pages/InvitationPage";
import InvitationNotFound from "@/pages/InvitationNotFound";

// Halaman admin di-lazy-load: tamu biasa (mayoritas pengunjung) tidak perlu
// mengunduh library scanner QR (html5-qrcode) & chart (recharts) yang cukup besar.
const AdminCheckin = lazy(() => import("@/pages/admin/AdminCheckin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal text-ivory text-sm">
      Memuat panel admin...
    </div>
  );
}

/**
 * Root aplikasi. Merangkai seluruh rute:
 *  - "/"              -> redirect berbasis ?code= (kompatibilitas lama) atau pesan "perlu tautan pribadi"
 *  - "/invite"        -> sama seperti "/", mendukung format /invite?code=XXXX
 *  - "/i/:code"       -> halaman undangan tamu (sumber data: backend, berdasarkan kode aman)
 *  - "/admin/checkin" -> panel staff untuk scan & validasi QR check-in
 *  - "/admin/dashboard" -> statistik & riwayat check-in real-time
 *  - "*"              -> halaman undangan tidak ditemukan
 */
export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/invite" element={<HomeRedirect />} />
        <Route path="/i/:code" element={<InvitationPage />} />
        <Route
          path="/admin/checkin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminCheckin />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route path="*" element={<InvitationNotFound variant="invalid" />} />
      </Routes>
    </ToastProvider>
  );
}
