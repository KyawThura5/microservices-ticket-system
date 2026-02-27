package com.order_service.service;

import java.util.List;

import com.order_service.dto.OrderRequestDto;
import com.order_service.dto.OrderResponseDto;

public interface OrderService {
	OrderResponseDto placeOrder(OrderRequestDto orderRequestDto);

	OrderResponseDto getOrderById(Long id);

	List<OrderResponseDto> getAllOrders();
}