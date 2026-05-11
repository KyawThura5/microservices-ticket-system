package com.customer_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
@Validated
@ConfigurationProperties(prefix = "keycloak.admin")
public class KeycloakAdminProperties {
    @NotBlank
    private String serverUrl;
    @NotBlank
    private String realm;
    @NotBlank
    private String adminRealm;
    @NotBlank
    private String clientId;
    @NotBlank
    private String adminUsername;
    @NotBlank
    private String adminPassword;
}
