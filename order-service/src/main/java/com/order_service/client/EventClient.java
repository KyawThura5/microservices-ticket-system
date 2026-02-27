package com.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.order_service.dto.EventResponseDto;

@FeignClient(name = "event-service")
public interface EventClient {
	@GetMapping("/api/events/{id}")
	EventResponseDto getEventById(@PathVariable("id") Long id);
}
