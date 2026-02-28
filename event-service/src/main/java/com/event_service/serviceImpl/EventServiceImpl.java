package com.event_service.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.event_service.client.VenueClient;
import com.event_service.dto.EventRequestDto;
import com.event_service.dto.EventResponseDto;
import com.event_service.dto.VenueDto;
import com.event_service.entity.Event;
import com.event_service.mapper.EventMapper;
import com.event_service.repository.EventRepository;
import com.event_service.service.EventService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

	private final EventRepository eventRepository;
	private final EventMapper eventMapper;
	private final VenueClient venueClient;

	@Override
	public EventResponseDto createEvent(EventRequestDto eventRequestDto) {

		VenueDto venue = venueClient.getVenueById(eventRequestDto.getVenueId());

		Event event = eventMapper.mapToEvent(eventRequestDto);

		event.setLeftCapacity(eventRequestDto.getTotalCapacity());
		Event savedEvent = eventRepository.save(event);

		return eventMapper.mapToEventResponseDto(savedEvent);
	}

	@Override
	public EventResponseDto getEventById(Long id) {
		Event event = eventRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
		return eventMapper.mapToEventResponseDto(event);
	}

	@Override
	public List<EventResponseDto> getAllEvents() {
		return eventRepository.findAll().stream().map(eventMapper::mapToEventResponseDto).collect(Collectors.toList());
	}

	@Override
	public EventResponseDto updateEvent(Long id, EventRequestDto eventRequestDto) {
		Event existingEvent = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));

		if (!existingEvent.getVenueId().equals(eventRequestDto.getVenueId())) {
			venueClient.getVenueById(eventRequestDto.getVenueId());
		}

		existingEvent.setName(eventRequestDto.getName());
		existingEvent.setVenueId(eventRequestDto.getVenueId());
		existingEvent.setTotalCapacity(eventRequestDto.getTotalCapacity());
		existingEvent.setLeftCapacity(eventRequestDto.getTotalCapacity());
		existingEvent.setTicketPrice(eventRequestDto.getTicketPrice());

		Event updatedEvent = eventRepository.save(existingEvent);
		return eventMapper.mapToEventResponseDto(updatedEvent);
	}

	@Override
	public void deleteEvent(Long id) {
		eventRepository.deleteById(id);
	}

	@Override
	@Transactional
	public void reduceCapacity(Long eventId, Long quantity) {
		Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

		if (event.getLeftCapacity() < quantity) {
			throw new RuntimeException("Sorry, only " + event.getLeftCapacity() + " tickets remaining.");
		}

		long newCapacity = event.getLeftCapacity() - quantity;
		event.setLeftCapacity(newCapacity);

		eventRepository.save(event);
		log.info("Updated Event ID {}: New Left Capacity is {}", eventId, newCapacity);
	}
}