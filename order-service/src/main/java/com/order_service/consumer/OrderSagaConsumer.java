package com.order_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.order_service.client.OrderRejectedEvent;
import com.order_service.constant.OrderStatus;
import com.order_service.dto.OrderConfirmedEvent;
import com.order_service.entity.Order;
import com.order_service.exception.ResourceNotFoundException;
import com.order_service.repository.OrderRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderSagaConsumer {

	private final OrderRepository orderRepository;

	@KafkaListener(topics = "${kafka.topic.order-confirmed}", groupId = "${KAFKA_ORDER_GROUP_ID:order-group}")
	public void handleConfirmation(OrderConfirmedEvent event) {
		log.info("Confirming Order ID: {}", event.getOrderId());
		updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED, null);
	}

	@KafkaListener(topics = "${kafka.topic.order-rejected}", groupId = "${KAFKA_ORDER_GROUP_ID:order-group}")
	public void handleRejection(OrderRejectedEvent event) {
		log.info("Rejecting Order ID: {} due to: {}", event.getOrderId(), event.getReason());
		updateOrderStatus(event.getOrderId(), OrderStatus.REJECTED, event.getReason());
	}

	private void updateOrderStatus(Long orderId, OrderStatus status, String reason) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		if (order.getStatus() == status) {
			log.info("Order {} is already in status {}", orderId, status);
			return;
		}
		order.setStatus(status);
		if (reason != null && !reason.isBlank()) {
			order.setFailureReason(reason);
		}
		orderRepository.save(order);
	}
}
