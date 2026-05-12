package com.customer_service.service.keycloak;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.customer_service.config.KeycloakAdminProperties;
import com.customer_service.exception.ConflictException;
import com.customer_service.exception.KeycloakProvisioningException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KeycloakUserProvisioningServiceImpl implements KeycloakUserProvisioningService {

    private final KeycloakAdminProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public KeycloakUserProvisioningServiceImpl(KeycloakAdminProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    @Override
    public String createUser(String username, String password, String email, String fullName) {
        String accessToken = getAdminAccessToken();

        // Extract firstName and lastName from fullName
        String firstName = fullName;
        String lastName = "User"; // Default lastName if no space in fullName
        if (fullName != null && fullName.contains(" ")) {
            String[] nameParts = fullName.trim().split("\\s+", 2);
            firstName = nameParts[0];
            lastName = nameParts.length > 1 ? nameParts[1] : "User";
        }

        Map<String, Object> payload = Map.of(
                "username", username,
                "email", email,
                "firstName", firstName,
                "lastName", lastName,
                "enabled", true,
                "emailVerified", true,
                "requiredActions", List.of(),
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", password,
                        "temporary", false)));

        try {
            String body = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(properties.getServerUrl() + "/admin/realms/" + properties.getRealm() + "/users"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + accessToken)
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                String location = response.headers().firstValue("location")
                        .orElseThrow(() -> new KeycloakProvisioningException("Missing location header from Keycloak"));
                String userId = location.substring(location.lastIndexOf('/') + 1);
                assignRealmRole(accessToken, userId, "CUSTOMER");
                return userId;
            }

            if (response.statusCode() == 409) {
                throw new ConflictException("User already exists in Keycloak");
            }

            throw new KeycloakProvisioningException("Failed to create user in Keycloak. Status: "
                    + response.statusCode() + ", response: " + response.body());

        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new KeycloakProvisioningException("Failed to call Keycloak", ex);
        } catch (IOException ex) {
            throw new KeycloakProvisioningException("Failed to call Keycloak", ex);
        }
    }

    @Override
    public void deleteUser(String userId) {
        String accessToken = getAdminAccessToken();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(properties.getServerUrl() + "/admin/realms/" + properties.getRealm() + "/users/" + userId))
                .header("Authorization", "Bearer " + accessToken)
                .DELETE()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 204 && response.statusCode() != 404) {
                throw new KeycloakProvisioningException("Failed to delete Keycloak user during rollback. Status: "
                        + response.statusCode() + ", response: " + response.body());
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new KeycloakProvisioningException("Interrupted while deleting Keycloak user", ex);
        } catch (IOException ex) {
            throw new KeycloakProvisioningException("Failed to delete Keycloak user", ex);
        }
    }

    private String getAdminAccessToken() {
        String form = "client_id=" + encode(properties.getClientId())
                + "&username=" + encode(properties.getAdminUsername())
                + "&password=" + encode(properties.getAdminPassword())
                + "&grant_type=password";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(properties.getServerUrl() + "/realms/" + properties.getAdminRealm()
                        + "/protocol/openid-connect/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new KeycloakProvisioningException("Failed to get admin token from Keycloak. Status: "
                        + response.statusCode() + ", response: " + response.body());
            }
            Map<String, Object> map = objectMapper.readValue(response.body(), new TypeReference<>() {
            });
            Object accessToken = map.get("access_token");
            if (accessToken == null) {
                throw new KeycloakProvisioningException("Keycloak token response missing access_token");
            }
            return accessToken.toString();
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new KeycloakProvisioningException("Failed to request Keycloak admin token", ex);
        } catch (IOException ex) {
            throw new KeycloakProvisioningException("Failed to request Keycloak admin token", ex);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private void assignRealmRole(String accessToken, String userId, String roleName) {
        Map<String, Object> role = fetchRealmRole(accessToken, roleName);
        String roleId = Objects.toString(role.get("id"), "");
        String resolvedRoleName = Objects.toString(role.get("name"), "");
        String description = Objects.toString(role.getOrDefault("description", ""), "");

        Map<String, Object> roleRepresentation = Map.of(
                "id", roleId,
                "name", resolvedRoleName,
                "description", description);

        if (roleId.isEmpty()) {
            throw new KeycloakProvisioningException("Keycloak role id is missing for role: " + roleName);
        }

        try {
            String body = objectMapper.writeValueAsString(List.of(roleRepresentation));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(properties.getServerUrl() + "/admin/realms/" + properties.getRealm()
                            + "/users/" + userId + "/role-mappings/realm"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + accessToken)
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 204) {
                throw new KeycloakProvisioningException("Failed to assign CUSTOMER role in Keycloak. Status: "
                        + response.statusCode() + ", response: " + response.body());
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new KeycloakProvisioningException("Failed to assign Keycloak realm role", ex);
        } catch (IOException ex) {
            throw new KeycloakProvisioningException("Failed to assign Keycloak realm role", ex);
        }
    }

    private Map<String, Object> fetchRealmRole(String accessToken, String roleName) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(properties.getServerUrl() + "/admin/realms/" + properties.getRealm()
                        + "/roles/" + encode(roleName)))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new KeycloakProvisioningException("Failed to fetch Keycloak role: " + roleName + ". Status: "
                        + response.statusCode() + ", response: " + response.body());
            }
            return objectMapper.readValue(response.body(), new TypeReference<>() {
            });
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new KeycloakProvisioningException("Failed to fetch Keycloak role", ex);
        } catch (IOException ex) {
            throw new KeycloakProvisioningException("Failed to fetch Keycloak role", ex);
        }
    }
}
