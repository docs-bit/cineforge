const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ACCESS_TOKEN_KEY = "cineforge.access_token";

export interface ApiErrorPayload {
  message?: string | string[];
  statusCode?: number;
  code?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}, idempotencyKey?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const raw = await response.text();
  const payload = raw ? (JSON.parse(raw) as ApiErrorPayload | T) : null;
  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    const message = Array.isArray(errorPayload?.message) ? errorPayload.message.join(", ") : errorPayload?.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status, errorPayload?.code);
  }
  return payload as T;
}

export function apiGet<T>(path: string, signal?: AbortSignal) {
  return request<T>(path, { method: "GET", signal });
}

export function apiPost<T>(path: string, body: unknown, signal?: AbortSignal, idempotencyKey?: string) {
  return request<T>(path, { method: "POST", body: JSON.stringify(body), signal }, idempotencyKey);
}

export function apiPut<T>(path: string, body: unknown, signal?: AbortSignal) {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body), signal });
}

export function apiDelete<T>(path: string, signal?: AbortSignal) {
  return request<T>(path, { method: "DELETE", signal });
}

export type AuthSessionResponse = { access_token?: string; refresh_token?: string; user?: { id: string; email?: string | null }; profile?: unknown };

export async function login(email: string, password: string) {
  const response = await apiPost<AuthSessionResponse>("/api/v1/auth/login", { email, password });
  if (response.access_token) setAccessToken(response.access_token);
  return response;
}

export async function register(email: string, password: string) {
  const response = await apiPost<AuthSessionResponse>("/api/v1/auth/register", { email, password });
  if (response.access_token) setAccessToken(response.access_token);
  return response;
}

export async function logout(accessToken?: string) {
  const token = accessToken || getAccessToken();
  if (token) await apiPost("/api/v1/auth/logout", { access_token: token });
  setAccessToken(null);
}
