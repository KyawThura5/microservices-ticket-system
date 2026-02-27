package com.order_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.order_service.client.OrderRejectedEvent;
import com.order_service.constant.OrderStatus;
import com.order_service.dto.OrderConfirmedEvent;
import com.order_service.entity.Order;
import com.order_service.repository.OrderRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderSagaConsumer {

	private final OrderRepository orderRepository;

	@KafkaListener(topics = "order-confirmed", groupId = "order-group")
	public void handleConfirmation(OrderConfirmedEvent event) {
		log.info("Confirming Order ID: {}", event.getOrderId());
		updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
	}

	@KafkaListener(topics = "order-rejected", groupId = "order-group")
	public void handleRejection(OrderRejectedEvent event) {
		log.info("Rejecting Order ID: {} due to: {}", event.getOrderId(), event.getReason());
		updateOrderStatus(event.getOrderId(), OrderStatus.REJECTED);
	}

	private void updateOrderStatus(Long orderId, OrderStatus status) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
		order.setStatus(status);
		orderRepository.save(order);
	}
}