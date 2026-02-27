package com.order_service.dto;

import lombok.Data;

@Data
public class OrderPlacedEvent {
	private Long eventId;
	private Long quantity;
}