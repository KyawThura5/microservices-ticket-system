package com.venue_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueDto {
	private Long id;
	@NotBlank
	private String name;
	@NotBlank
	private String address;
	@NotNull
	@Positive
	private Long totalCapacity;
}
