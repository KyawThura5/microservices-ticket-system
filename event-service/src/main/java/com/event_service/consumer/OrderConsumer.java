package com.event_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.event_service.client.OrderRejectedEvent;
import com.event_service.dto.OrderConfirmedEvent;
import com.event_service.dto.OrderPlacedEvent;
import com.event_service.service.EventService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderConsumer {

    private final EventService eventService;
	private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "order-placed", groupId = "event-group")
    public void consume(OrderPlacedEvent event) {

		log.info("Received OrderPlacedEvent from Kafka: Event ID {}, Quantity {}", event.getEventId(),
				event.getQuantity());

        try {

            eventService.reduceCapacity(event.getEventId(), event.getQuantity());

			log.info("Capacity reduced successfully for Order ID {}", event.getOrderId());
			kafkaTemplate.send("order-confirmed", new OrderConfirmedEvent(event.getOrderId()));

        } catch (Exception e) {
			log.error("Failed to update capacity for Event ID {}: {}", event.getEventId(), e.getMessage());

			OrderRejectedEvent rejection = new OrderRejectedEvent(event.getOrderId(), e.getMessage() // "Not enough //
																										// tickets //
																										// available!"
			);
			kafkaTemplate.send("order-rejected", rejection);
			log.info("Sent OrderRejectedEvent to Kafka for Order ID: {}", event.getOrderId());
        }
    }
}