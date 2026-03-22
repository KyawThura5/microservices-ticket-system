package com.venue_service.exception;

import java.time.OffsetDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponse {
	private OffsetDateTime timestamp;
	private int status;
	private String error;
	private String message;
	private String path;
}
