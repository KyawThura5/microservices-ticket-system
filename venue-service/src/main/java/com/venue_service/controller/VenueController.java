package com.venue_service.controller;

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

import com.venue_service.dto.VenueDto;
import com.venue_service.service.VenueService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/venues")
@AllArgsConstructor
public class VenueController {

	private final VenueService venueService;

	// Create Venue REST API
	@PostMapping
	public ResponseEntity<VenueDto> createVenue(@RequestBody VenueDto venueDto) {
		VenueDto savedVenue = venueService.createVenue(venueDto);
		return new ResponseEntity<>(savedVenue, HttpStatus.CREATED);
	}

	// Get Venue by ID REST API
	@GetMapping("{id}")
	public ResponseEntity<VenueDto> getVenueById(@PathVariable("id") Long venueId) {
		VenueDto venueDto = venueService.getVenueById(venueId);
		return ResponseEntity.ok(venueDto);
	}

	// Get All Venues REST API
	@GetMapping
	public ResponseEntity<List<VenueDto>> getAllVenues() {
		List<VenueDto> venues = venueService.getAllVenues();
		return ResponseEntity.ok(venues);
	}

	// Update Venue REST API
	@PutMapping("{id}")
	public ResponseEntity<VenueDto> updateVenue(@PathVariable("id") Long venueId, @RequestBody VenueDto updatedVenue) {
		VenueDto venueDto = venueService.updateVenue(venueId, updatedVenue);
		return ResponseEntity.ok(venueDto);
	}

	// Delete Venue REST API
	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteVenue(@PathVariable("id") Long venueId) {
		venueService.deleteVenue(venueId);
		return ResponseEntity.ok("Venue deleted successfully!.");
	}
}