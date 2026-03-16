package com.order_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.order_service.dto.OrderRequestDto;
import com.order_service.dto.OrderResponseDto;
import com.order_service.service.OrderService;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
@Tag(name = "Order Management", description = "Endpoints for creating and tracking orders in the Saga flow")
public class OrderController {

	private final OrderService orderService;

	@Operation(summary = "Place a new order", description = "Starts the Saga. Order is saved as PENDING and sent to Kafka.")
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Order created successfully"),
			@ApiResponse(responseCode = "400", description = "Invalid input or sold out") })
	@PostMapping
	public ResponseEntity<OrderResponseDto> placeOrder(@Valid @RequestBody OrderRequestDto orderRequestDto) {
		OrderResponseDto savedOrder = orderService.placeOrder(orderRequestDto);
		return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
	}

	@Operation(summary = "Get order details", description = "Use this to poll for status changes (PENDING -> CONFIRMED/REJECTED)")
	@GetMapping("/{id}")
	public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable Long id) {
		return ResponseEntity.ok(orderService.getOrderById(id));
	}

	@GetMapping
	public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
		return ResponseEntity.ok(orderService.getAllOrders());
	}
}
