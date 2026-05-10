function readEnv(name, fallback = "") {
  const value = import.meta.env[name];
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }
  return fallback;
}

export const env = {
  apiBaseUrl: readEnv("VITE_API_BASE_URL", ""),
  keycloakUrl: readEnv("VITE_KEYCLOAK_URL", "http://localhost:8080"),
  keycloakRealm: readEnv("VITE_KEYCLOAK_REALM", ""),
  keycloakClientId: readEnv("VITE_KEYCLOAK_CLIENT_ID", ""),
};

export function logEnvConfig() {
  if (!import.meta.env.DEV) return;
  console.info("[env] config", {
    apiBaseUrl: env.apiBaseUrl || "(vite proxy)",
    keycloakUrl: env.keycloakUrl || "(missing)",
    keycloakRealm: env.keycloakRealm || "(missing)",
    keycloakClientId: env.keycloakClientId || "(missing)",
  });
}
