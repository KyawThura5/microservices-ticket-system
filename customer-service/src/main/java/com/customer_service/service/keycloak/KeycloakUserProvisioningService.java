package com.customer_service.service.keycloak;

public interface KeycloakUserProvisioningService {
    String createUser(String username, String password, String email, String fullName);
    void deleteUser(String userId);
}
