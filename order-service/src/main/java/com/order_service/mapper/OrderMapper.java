package com.order_service.mapper;

import org.springframework.stereotype.Component;

import com.order_service.dto.OrderRequestDto;
import com.order_service.dto.OrderResponseDto;
import com.order_service.entity.Order;

@Component
public class OrderMapper {

	// 1. Map Request -> Entity (Used when placing a new order)
	public Order mapToOrder(OrderRequestDto requestDto) {
		Order order = new Order();
		order.setQuantity(requestDto.getQuantity());
		order.setCustomerId(requestDto.getCustomerId());
		order.setEventId(requestDto.getEventId());
		return order;
	}

	// 2. Map Entity -> Response (Used for the API return value)
	public OrderResponseDto mapToResponseDto(Order order) {
		OrderResponseDto response = new OrderResponseDto();
		response.setId(order.getId());
		response.setTotal(order.getTotal());
		response.setQuantity(order.getQuantity());
		response.setPlacedAt(order.getPlacedAt());
		response.setCustomerId(order.getCustomerId());
		response.setEventId(order.getEventId());
		return response;
	}
}