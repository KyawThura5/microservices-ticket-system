package com.venue_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.venue_service.entity.Venue;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {

}