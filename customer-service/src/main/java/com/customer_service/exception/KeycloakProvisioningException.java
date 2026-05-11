package com.customer_service.exception;

public class KeycloakProvisioningException extends RuntimeException {
    public KeycloakProvisioningException(String message) {
        super(message);
    }

    public KeycloakProvisioningException(String message, Throwable cause) {
        super(message, cause);
    }
}
