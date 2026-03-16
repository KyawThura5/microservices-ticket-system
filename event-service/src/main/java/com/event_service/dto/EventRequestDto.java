package com.event_service.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class EventRequestDto {
	@NotBlank
	private String name;
	@NotNull
	private Long venueId;
	@NotNull
	@Positive
	private Long totalCapacity;
	@NotNull
	@Positive
	private BigDecimal ticketPrice;
}
