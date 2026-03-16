package com.event_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.event_service.client.OrderRejectedEvent;
import com.event_service.dto.OrderConfirmedEvent;
import com.event_service.dto.OrderPlacedEvent;
import com.event_service.service.EventService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OrderConsumer {

    private final EventService eventService;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final String orderConfirmedTopic;
	private final String orderRejectedTopic;

	public OrderConsumer(EventService eventService, KafkaTemplate<String, Object> kafkaTemplate,
			@Value("${kafka.topic.order-confirmed}") String orderConfirmedTopic,
			@Value("${kafka.topic.order-rejected}") String orderRejectedTopic) {
		this.eventService = eventService;
		this.kafkaTemplate = kafkaTemplate;
		this.orderConfirmedTopic = orderConfirmedTopic;
		this.orderRejectedTopic = orderRejectedTopic;
	}

    @KafkaListener(topics = "${kafka.topic.order-placed}", groupId = "${KAFKA_EVENT_GROUP_ID:event-group}")
    public void consume(OrderPlacedEvent event) {

		log.info("Received OrderPlacedEvent from Kafka: Event ID {}, Quantity {}", event.getEventId(),
				event.getQuantity());

        try {

            eventService.reduceCapacity(event.getEventId(), event.getQuantity());

			log.info("Capacity reduced successfully for Order ID {}", event.getOrderId());
			kafkaTemplate.send(orderConfirmedTopic, new OrderConfirmedEvent(event.getOrderId()));

        } catch (Exception e) {
			log.error("Failed to update capacity for Event ID {}: {}", event.getEventId(), e.getMessage());

			OrderRejectedEvent rejection = new OrderRejectedEvent(event.getOrderId(), e.getMessage() // "Not enough //
																										// tickets //
																										// available!"
			);
			kafkaTemplate.send(orderRejectedTopic, rejection);
			log.info("Sent OrderRejectedEvent to Kafka for Order ID: {}", event.getOrderId());
        }
    }
}
