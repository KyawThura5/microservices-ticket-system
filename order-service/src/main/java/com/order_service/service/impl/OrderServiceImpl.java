package com.order_service.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.Jwt;

import com.order_service.client.CustomerClient;
import com.order_service.client.EventClient;
import com.order_service.dto.CustomerResponseDto;
import com.order_service.constant.OrderStatus;
import com.order_service.dto.EventResponseDto;
import com.order_service.dto.OrderPlacedEvent;
import com.order_service.dto.OrderRequestDto;
import com.order_service.dto.OrderResponseDto;
import com.order_service.entity.Order;
import com.order_service.exception.ResourceNotFoundException;
import com.order_service.mapper.OrderMapper;
import com.order_service.repository.OrderRepository;
import com.order_service.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final OrderMapper orderMapper;
	private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;
	private final EventClient eventClient;
	private final CustomerClient customerClient;
	private final String orderPlacedTopic;

	public OrderServiceImpl(OrderRepository orderRepository, OrderMapper orderMapper,
			KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate, EventClient eventClient, CustomerClient customerClient,
			@Value("${kafka.topic.order-placed}") String orderPlacedTopic) {
		this.orderRepository = orderRepository;
		this.orderMapper = orderMapper;
		this.kafkaTemplate = kafkaTemplate;
		this.eventClient = eventClient;
		this.customerClient = customerClient;
		this.orderPlacedTopic = orderPlacedTopic;
	}

	@Override
	@Transactional // Ensures order is saved before Kafka message is considered part of the flow
	public OrderResponseDto placeOrder(OrderRequestDto orderDto, Jwt jwt, String authorizationHeader) {
		Long resolvedCustomerId = resolveCustomerId(orderDto, jwt, authorizationHeader);
		orderDto.setCustomerId(resolvedCustomerId);

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
		kafkaTemplate.send(orderPlacedTopic, event);

		return orderMapper.mapToResponseDto(savedOrder);
	}

	private Long resolveCustomerId(OrderRequestDto orderDto, Jwt jwt, String authorizationHeader) {
		if (isAdmin(jwt) && orderDto.getCustomerId() != null) {
			return orderDto.getCustomerId();
		}
		CustomerResponseDto customer = customerClient.getCurrentCustomer(authorizationHeader);
		return customer.getId();
	}

	@SuppressWarnings("unchecked")
	private boolean isAdmin(Jwt jwt) {
		Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
		if (realmAccess == null) {
			return false;
		}
		Object rolesClaim = realmAccess.get("roles");
		if (!(rolesClaim instanceof Collection<?> roles)) {
			return false;
		}
		return roles.stream().map(Object::toString).anyMatch("ADMIN"::equals);
	}

	@Override
	public OrderResponseDto getOrderById(Long id, Jwt jwt, String authorizationHeader) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

		if (!isAdmin(jwt)) {
			Long currentCustomerId = customerClient.getCurrentCustomer(authorizationHeader).getId();
			if (!currentCustomerId.equals(order.getCustomerId())) {
				throw new AccessDeniedException("You are not allowed to access this order");
			}
		}
		return orderMapper.mapToResponseDto(order);
	}

	@Override
	public List<OrderResponseDto> getAllOrders(Jwt jwt, String authorizationHeader) {
		if (isAdmin(jwt)) {
			return orderRepository.findAll().stream().map(orderMapper::mapToResponseDto).collect(Collectors.toList());
		}
		Long currentCustomerId = customerClient.getCurrentCustomer(authorizationHeader).getId();
		return orderRepository.findAll().stream()
				.filter(order -> currentCustomerId.equals(order.getCustomerId()))
				.map(orderMapper::mapToResponseDto)
				.collect(Collectors.toList());
	}
}
