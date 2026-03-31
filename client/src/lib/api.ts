const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const SESSION_USER_KEY = "futlynk_session_user_id";
export const DEFAULT_USER_ID = "u-me";

export function getCurrentUserId(): string {
  return localStorage.getItem(SESSION_USER_KEY) ?? DEFAULT_USER_ID;
}

export function setCurrentUserId(userId: string): void {
  localStorage.setItem(SESSION_USER_KEY, userId);
}

export function clearCurrentUserId(): void {
  localStorage.removeItem(SESSION_USER_KEY);
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const fallback = `Request failed: ${response.status}`;
    try {
      const payload = (await response.json()) as { detail?: string };
      throw new Error(payload.detail ?? fallback);
    } catch {
      throw new Error(fallback);
    }
  }

  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, "GET");
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, "POST", body);
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, "PUT", body);
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, "DELETE");
}
