package com.customer_service.utils;

import java.util.regex.Pattern;

public class CustomerUtils {

	private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

	private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9]{7,15}$"); // Supports optional + and 7-15
																						// digits

	// Validate email format
	public static boolean isValidEmail(String email) {
		return email != null && EMAIL_PATTERN.matcher(email).matches();
	}

	// Validate phone number format
	public static boolean isValidPhoneNumber(String phoneNumber) {
		return phoneNumber != null && PHONE_PATTERN.matcher(phoneNumber).matches();
	}
}