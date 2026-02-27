package com.venue_service.mapper;

import org.springframework.stereotype.Component;

import com.venue_service.dto.VenueDto;
import com.venue_service.entity.Venue;

@Component
public class VenueMapper {

	public static VenueDto mapToVenueDto(Venue venue) {
		return new VenueDto(venue.getId(), venue.getName(), venue.getAddress(), venue.getTotalCapacity());
	}

	public static Venue mapToVenue(VenueDto venueDto) {
		return new Venue(venueDto.getId(), venueDto.getName(), venueDto.getAddress(), venueDto.getTotalCapacity());
	}
}