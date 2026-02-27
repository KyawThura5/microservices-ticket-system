package com.event_service.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class EventRequestDto {
	private String name;
	private Long venueId;
	private Long totalCapacity;
	private BigDecimal ticketPrice;
}