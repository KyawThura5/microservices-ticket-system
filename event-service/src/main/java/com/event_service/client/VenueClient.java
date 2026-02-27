package com.event_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.event_service.dto.VenueDto;

@FeignClient(name = "venue-service")
public interface VenueClient {

	@GetMapping("/api/venues/{id}")
	VenueDto getVenueById(@PathVariable("id") Long id);
}