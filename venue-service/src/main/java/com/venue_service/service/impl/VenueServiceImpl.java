package com.venue_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.venue_service.dto.VenueDto;
import com.venue_service.entity.Venue;
import com.venue_service.exception.ResourceNotFoundException;
import com.venue_service.mapper.VenueMapper;
import com.venue_service.repository.VenueRepository;
import com.venue_service.service.VenueService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class VenueServiceImpl implements VenueService {

	private final VenueRepository venueRepository;

	@Override
	public VenueDto createVenue(VenueDto venueDto) {
		Venue venue = VenueMapper.mapToVenue(venueDto);
		Venue savedVenue = venueRepository.save(venue);
		return VenueMapper.mapToVenueDto(savedVenue);
	}

	@Override
	public VenueDto getVenueById(Long id) {
		Venue venue = venueRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
		return VenueMapper.mapToVenueDto(venue);
	}

	@Override
	public List<VenueDto> getAllVenues() {
		return venueRepository.findAll().stream().map(VenueMapper::mapToVenueDto).collect(Collectors.toList());
	}

	@Override
	public VenueDto updateVenue(Long id, VenueDto updatedVenueDto) {
		Venue venue = venueRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

		venue.setName(updatedVenueDto.getName());
		venue.setAddress(updatedVenueDto.getAddress());
		venue.setTotalCapacity(updatedVenueDto.getTotalCapacity());

		Venue updatedVenueObj = venueRepository.save(venue);
		return VenueMapper.mapToVenueDto(updatedVenueObj);
	}

	@Override
	public void deleteVenue(Long id) {
		if (!venueRepository.existsById(id)) {
			throw new ResourceNotFoundException("Venue not found with id: " + id);
		}
		venueRepository.deleteById(id);
	}
}
