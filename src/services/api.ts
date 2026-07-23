const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(body?.error || body?.message || `Request gagal (${res.status})`, res.status);
  }
  return body as T;
}

// ---------- Admin Auth ----------

export interface AdminLoginResponse {
  token: string;
  expiresIn: string;
}

export function adminLogin(adminKey: string): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>(
    "/api/admin/login",
    { method: "POST", body: JSON.stringify({ adminKey }) }
  );
}

export function verifyAdminKey(adminKey: string) {
  return adminLogin(adminKey);
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
  token: string
): Promise<GeneratedInvitation> {
  return request<GeneratedInvitation>(
    "/api/invitation/generate",
    { method: "POST", body: JSON.stringify(data) },
    token
  );
}

export interface InvitationListResponse {
  invitations: InvitationRecord[];
  total: number;
  page: number;
  totalPages: number;
}

export function adminListInvitations(
  token: string,
  page = 1,
  limit = 50,
  search = ""
): Promise<InvitationListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  return request<InvitationListResponse>(`/api/invitation?${params}`, {}, token);
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
  authToken: string
): Promise<CheckinResult> {
  const res = await fetch(`${API_BASE_URL}/api/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (res.status === 200 || res.status === 404 || res.status === 409) {
    return body as CheckinResult;
  }
  if (res.status === 401) {
    throw new ApiError("Sesi berakhir. Silakan login kembali.", 401);
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

export function adminGetStatistics(token: string): Promise<DashboardStatistics> {
  return request<DashboardStatistics>("/api/dashboard/statistics", {}, token);
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "scan_success" | "scan_duplicate" | "scan_invalid";
  scanMethod: "qr_token" | "manual_code" | null;
  scannedBy: string;
  invitationCode: string | null;
}

export function adminGetHistory(token: string, limit = 50): Promise<{ logs: AuditLogEntry[] }> {
  return request<{ logs: AuditLogEntry[] }>(`/api/dashboard/history?limit=${limit}`, {}, token);
}

// ---------- RSVP ----------

export interface RsvpPayload {
  name: string;
  phone?: string;
  guests: number;
  attendance: "attending" | "not_attending";
  message?: string;
  invitationCode?: string;
}

export interface RsvpResponse {
  id: string;
  name: string;
  phone: string | null;
  guests: number;
  attendance: string;
  message: string | null;
  invitationCode: string | null;
  createdAt: string;
}

export function submitRsvp(data: RsvpPayload): Promise<RsvpResponse> {
  return request<RsvpResponse>(
    "/api/rsvp",
    { method: "POST", body: JSON.stringify(data) }
  );
}

// ---------- Wishes ----------

export interface WishPayload {
  name: string;
  message: string;
  attendance?: "attending" | "not_attending" | "pending";
}

export interface WishResponse {
  id: string;
  name: string;
  message: string;
  attendance: string;
  createdAt: string;
}

export interface WishListResponse {
  wishes: WishResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export function submitWish(data: WishPayload): Promise<WishResponse> {
  return request<WishResponse>(
    "/api/wishes",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function fetchWishes(page = 1, limit = 50): Promise<WishListResponse> {
  return request<WishListResponse>(`/api/wishes?page=${page}&limit=${limit}`);
}
