package com.order_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class OrderResponseDto {
	private Long id;
	private BigDecimal total;
	private Long quantity;
	private LocalDateTime placedAt;
	private Long customerId;
	private Long eventId;
}
