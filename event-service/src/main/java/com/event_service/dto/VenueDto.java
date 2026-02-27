package com.event_service.dto;

import lombok.Data;

@Data
public class VenueDto {
	private Long id;
	private String name;
	private String address;
	private Long totalCapacity;
}