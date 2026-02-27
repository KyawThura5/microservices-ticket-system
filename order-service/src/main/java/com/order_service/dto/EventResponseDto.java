package com.order_service.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventResponseDto {
	private Long id;
	private BigDecimal ticketPrice;
}