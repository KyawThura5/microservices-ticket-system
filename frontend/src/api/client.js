import { env } from "../config/env";

const API_BASE = env.apiBaseUrl;
const AUTH_TOKEN_KEY = "ticket_auth_token";

export function getAuthToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getApiBase() {
  return API_BASE || "(vite proxy)";
}

export async function apiGet(path) {
  const headers = {};
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, { headers });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed (${response.status})`);
  }

  return response.json();
}

export async function apiSend(path, method, body) {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => null);
      const message = data?.message || data?.error || data?.path || "";
      throw new Error(message || `Request failed (${response.status})`);
    }
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
