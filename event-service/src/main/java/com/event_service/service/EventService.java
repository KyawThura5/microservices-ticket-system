package com.event_service.service;

import java.util.List;

import com.event_service.dto.EventRequestDto;
import com.event_service.dto.EventResponseDto;

public interface EventService {
	EventResponseDto createEvent(EventRequestDto eventRequestDto);

	EventResponseDto getEventById(Long id);

	List<EventResponseDto> getAllEvents();

	EventResponseDto updateEvent(Long id, EventRequestDto eventDto);

	void deleteEvent(Long id);

	void reduceCapacity(Long eventId, Long quantity);
}