package com.customer_service.exception;

public class CustomerRegistrationException extends RuntimeException {
    public CustomerRegistrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
