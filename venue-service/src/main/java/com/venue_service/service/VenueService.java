package com.venue_service.service;

import java.util.List;

import com.venue_service.dto.VenueDto;

public interface VenueService {
	VenueDto createVenue(VenueDto venueDto);

	VenueDto getVenueById(Long id);

	List<VenueDto> getAllVenues();

	VenueDto updateVenue(Long id, VenueDto updatedVenue);

	void deleteVenue(Long id);
}