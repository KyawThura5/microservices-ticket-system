package com.order_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OrderRequestDto {
	@NotNull
	@Positive
	private Long quantity;
	@NotNull
	private Long customerId;
	@NotNull
	private Long eventId;
}
