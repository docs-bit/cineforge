const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiError {
  message: string;
  statusCode: number;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      message: `Request failed (${res.status})`,
      statusCode: res.status,
    }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      message: `Request failed (${res.status})`,
      statusCode: res.status,
    }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}
