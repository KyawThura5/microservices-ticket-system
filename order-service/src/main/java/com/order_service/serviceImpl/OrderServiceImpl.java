package com.order_service.serviceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.order_service.client.EventClient;
import com.order_service.constant.OrderStatus;
import com.order_service.dto.EventResponseDto;
import com.order_service.dto.OrderPlacedEvent;
import com.order_service.dto.OrderRequestDto;
import com.order_service.dto.OrderResponseDto;
import com.order_service.entity.Order;
import com.order_service.mapper.OrderMapper;
import com.order_service.repository.OrderRepository;
import com.order_service.service.OrderService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final OrderMapper orderMapper;
	private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;
	private final EventClient eventClient;

	@Override
	@Transactional // Ensures order is saved before Kafka message is considered part of the flow
	public OrderResponseDto placeOrder(OrderRequestDto orderDto) {

		Order order = orderMapper.mapToOrder(orderDto);
		order.setPlacedAt(LocalDateTime.now());
		order.setStatus(OrderStatus.PENDING);

		EventResponseDto eventDetails = eventClient.getEventById(orderDto.getEventId());

		BigDecimal total = eventDetails.getTicketPrice().multiply(BigDecimal.valueOf(order.getQuantity()));
		order.setTotal(total);

		Order savedOrder = orderRepository.save(order);

		OrderPlacedEvent event = new OrderPlacedEvent(savedOrder.getId(), savedOrder.getEventId(),
				savedOrder.getQuantity());

		log.info("Order created as PENDING. Sending to Kafka: {}", event);
		kafkaTemplate.send("order-placed", event);

		return orderMapper.mapToResponseDto(savedOrder);
	}

	@Override
	public OrderResponseDto getOrderById(Long id) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
		return orderMapper.mapToResponseDto(order);
	}

	@Override
	public List<OrderResponseDto> getAllOrders() {
		return orderRepository.findAll().stream().map(orderMapper::mapToResponseDto).collect(Collectors.toList());
	}
}