package com.order_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.order_service.constant.OrderStatus;

import lombok.Data;

@Data
public class OrderResponseDto {
	private Long id;
	private BigDecimal total;
	private Long quantity;
	private LocalDateTime placedAt;
	private Long customerId;
	private Long eventId;
	private OrderStatus orderStatus;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String failureReason;
}
