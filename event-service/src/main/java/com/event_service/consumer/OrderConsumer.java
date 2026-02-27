package com.event_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.event_service.service.EventService;
import com.order_service.dto.OrderPlacedEvent;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class OrderConsumer {

    private final EventService eventService;

    @KafkaListener(topics = "order-placed", groupId = "event-group")
    public void consume(OrderPlacedEvent event) {
		log.info("Received OrderPlacedEvent from Kafka: Event ID {}, Quantity {}", event.getEventId(),
				event.getQuantity());

        try {
            eventService.reduceCapacity(event.getEventId(), event.getQuantity());
        } catch (Exception e) {
			log.error("Failed to update capacity for Event ID {}: {}", event.getEventId(), e.getMessage());
        }
    }
}