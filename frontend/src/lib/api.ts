export type Tokens = { access: string; refresh: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export function saveTokens(tokens: Tokens) {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
}

export function getAccessToken() {
  return typeof window !== "undefined" ? localStorage.getItem("access") : null;
}

export async function exchangeGoogleIdToken(id_token: string): Promise<Tokens> {
  const res = await fetch(`${API_BASE}/api/auth/google/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
  });
  if (!res.ok) throw new Error("Google login failed");
  const tokens = (await res.json()) as Tokens;
  saveTokens(tokens);
  return tokens;
}

export async function apiGet<T>(path: string): Promise<T> {
  const access = getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: access ? { Authorization: `Bearer ${access}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return (await res.json()) as T;
}


