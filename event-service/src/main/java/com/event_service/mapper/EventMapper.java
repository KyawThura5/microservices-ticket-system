package com.event_service.mapper;

import org.springframework.stereotype.Component;

import com.event_service.dto.EventRequestDto;
import com.event_service.dto.EventResponseDto;
import com.event_service.entity.Event;

@Component
public class EventMapper {

	// Entity -> Response
	public EventResponseDto mapToEventResponseDto(Event event) {
		return new EventResponseDto(event.getId(), event.getName(), event.getVenueId(), event.getTotalCapacity(),
				event.getLeftCapacity(), event.getTicketPrice());
	}

	// Request -> Entity
	public Event mapToEvent(EventRequestDto requestDto) {
		Event event = new Event();
		event.setName(requestDto.getName());
		event.setVenueId(requestDto.getVenueId());
		event.setTicketPrice(requestDto.getTicketPrice());
		event.setTotalCapacity(requestDto.getTotalCapacity());
		return event;
	}
}