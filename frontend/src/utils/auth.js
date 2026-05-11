export function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function extractRoles(payload) {
  const roles = payload?.realm_access?.roles;
  if (!Array.isArray(roles)) return [];
  return roles.map((role) => String(role).toUpperCase());
}

export function hasRole(roles, role) {
  return Array.isArray(roles) && roles.includes(String(role).toUpperCase());
}
