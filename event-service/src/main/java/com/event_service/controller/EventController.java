package com.event_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event_service.dto.EventRequestDto;
import com.event_service.dto.EventResponseDto;
import com.event_service.service.EventService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/events")
@AllArgsConstructor
public class EventController {

	private final EventService eventService;

	@PostMapping
	public ResponseEntity<EventResponseDto> createEvent(@Valid @RequestBody EventRequestDto eventRequestDto) {
		return new ResponseEntity<>(eventService.createEvent(eventRequestDto), HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<EventResponseDto> getEventById(@PathVariable Long id) {
		return ResponseEntity.ok(eventService.getEventById(id));
	}

	@GetMapping
	public ResponseEntity<List<EventResponseDto>> getAllEvents() {
		return ResponseEntity.ok(eventService.getAllEvents());
	}

	// Update Event REST API
	@PutMapping("/{id}")
	public ResponseEntity<EventResponseDto> updateEvent(@PathVariable Long id,
			@Valid @RequestBody EventRequestDto eventRequestDto) {
		EventResponseDto updatedEvent = eventService.updateEvent(id, eventRequestDto);
		return ResponseEntity.ok(updatedEvent);
	}

	// Delete Event REST API
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
		eventService.deleteEvent(id);
		return ResponseEntity.ok("Event deleted successfully!");
	}
}
