import { env } from "../config/env";

function assertAuthEnv() {
  if (!env.keycloakRealm || !env.keycloakClientId) {
    throw new Error("Keycloak env is missing. Set VITE_KEYCLOAK_REALM and VITE_KEYCLOAK_CLIENT_ID.");
  }
}

function tokenEndpoint() {
  return `${env.keycloakUrl}/realms/${env.keycloakRealm}/protocol/openid-connect/token`;
}

export async function loginWithPassword({ username, password }) {
  assertAuthEnv();
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: env.keycloakClientId,
    username,
    password,
  });

  const response = await fetch(tokenEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    const message = data?.error_description || data?.error || `Login failed (${response.status})`;
    throw new Error(message);
  }
  if (!data?.access_token) {
    throw new Error("Login response is missing access_token.");
  }
  return data;
}
