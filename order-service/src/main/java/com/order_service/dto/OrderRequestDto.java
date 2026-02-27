package com.order_service.dto;

import lombok.Data;

@Data
public class OrderRequestDto {
	private Long quantity;
	private Long customerId;
	private Long eventId;
}