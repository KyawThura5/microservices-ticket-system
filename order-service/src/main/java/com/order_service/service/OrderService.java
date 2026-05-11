package com.order_service.service;

import java.util.List;

import com.order_service.dto.OrderRequestDto;
import com.order_service.dto.OrderResponseDto;
import org.springframework.security.oauth2.jwt.Jwt;

public interface OrderService {
	OrderResponseDto placeOrder(OrderRequestDto orderRequestDto, Jwt jwt, String authorizationHeader);

	OrderResponseDto getOrderById(Long id, Jwt jwt, String authorizationHeader);

	List<OrderResponseDto> getAllOrders(Jwt jwt, String authorizationHeader);
}
