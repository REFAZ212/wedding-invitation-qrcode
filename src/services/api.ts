const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, adminKey?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (adminKey) headers["x-admin-key"] = adminKey;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(body?.error || body?.message || `Request gagal (${res.status})`, res.status);
  }
  return body as T;
}

// ---------- Public: guest-facing ----------

export interface InvitationPublicData {
  guestName: string;
  maxGuests: number;
  checkedIn: boolean;
  invitationCode: string;
  qrToken: string;
}

export function fetchInvitationByCode(code: string): Promise<InvitationPublicData> {
  return request<InvitationPublicData>(`/api/invitation/${encodeURIComponent(code)}`);
}

// ---------- Admin: invitation management ----------

export interface InvitationRecord {
  id: string;
  guestName: string;
  invitationCode: string;
  maxGuests: number;
  checkedIn: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedInvitation extends InvitationRecord {
  qrToken: string;
  invitationUrl: string;
}

export function adminGenerateInvitation(
  data: { guestName: string; maxGuests: number },
  adminKey: string
): Promise<GeneratedInvitation> {
  return request<GeneratedInvitation>(
    "/api/invitation/generate",
    { method: "POST", body: JSON.stringify(data) },
    adminKey
  );
}

export function adminListInvitations(adminKey: string): Promise<{ invitations: InvitationRecord[] }> {
  return request<{ invitations: InvitationRecord[] }>("/api/invitation", {}, adminKey);
}

// ---------- Admin: check-in ----------

export type CheckinStatus = "success" | "already_used" | "invalid";

export interface CheckinResult {
  status: CheckinStatus;
  message: string;
  guestName?: string;
  invitationCode?: string;
  maxGuests?: number;
  checkedInAt?: string | null;
  checkedInBy?: string | null;
}

export async function adminCheckin(
  payload: { token?: string; code?: string; staffName?: string },
  adminKey: string
): Promise<CheckinResult> {
  const res = await fetch(`${API_BASE_URL}/api/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);

  // 200 (success), 404 (invalid), dan 409 (already_used) semuanya respons terstruktur yang sah.
  if (res.status === 200 || res.status === 404 || res.status === 409) {
    return body as CheckinResult;
  }

  if (res.status === 401) {
    throw new ApiError("Admin key tidak valid atau sesi berakhir.", 401);
  }

  throw new ApiError(body?.error || `Request gagal (${res.status})`, res.status);
}

// ---------- Admin: dashboard ----------

export interface DashboardStatistics {
  totalInvitations: number;
  invitationsSent: number;
  guestsCheckedIn: number;
  guestsNotYetArrived: number;
  totalGuestCapacity: number;
  percentageAttendance: number;
  todayCheckIns: number;
}

export function adminGetStatistics(adminKey: string): Promise<DashboardStatistics> {
  return request<DashboardStatistics>("/api/dashboard/statistics", {}, adminKey);
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "scan_success" | "scan_duplicate" | "scan_invalid";
  scanMethod: "qr_token" | "manual_code" | null;
  scannedBy: string;
  invitationCode: string | null;
}

export function adminGetHistory(adminKey: string, limit = 50): Promise<{ logs: AuditLogEntry[] }> {
  return request<{ logs: AuditLogEntry[] }>(`/api/dashboard/history?limit=${limit}`, {}, adminKey);
}

export function verifyAdminKey(adminKey: string): Promise<DashboardStatistics> {
  return adminGetStatistics(adminKey);
}
