package com.event_service.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDto {
	private Long id;
	private String name;
	private Long venueId;
	private Long totalCapacity;
	private Long leftCapacity;
	private BigDecimal ticketPrice;
}