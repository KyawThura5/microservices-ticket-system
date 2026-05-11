package com.customer_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.customer_service.dto.CustomerRegistrationRequest;
import com.customer_service.dto.CustomerDTO;
import com.customer_service.service.CustomerService;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	private final CustomerService customerService;

	public CustomerController(CustomerService customerService) {
		this.customerService = customerService;
	}

	// Create a new customer
	@PostMapping
	public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
		CustomerDTO createdCustomer = customerService.createCustomer(customerDTO);
		return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
	}

	@PostMapping("/register")
	public ResponseEntity<CustomerDTO> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest request) {
		CustomerDTO createdCustomer = customerService.registerCustomer(request);
		return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
	}

	// Get all customers
	@GetMapping
	public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
		List<CustomerDTO> customers = customerService.getAllCustomers();
		return ResponseEntity.ok(customers);
	}

	// Get customer by ID
	@GetMapping("/{id}")
	public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
		CustomerDTO customer = customerService.getCustomerById(id);
		return ResponseEntity.ok(customer);
	}

	@GetMapping("/me")
	public ResponseEntity<CustomerDTO> getCurrentCustomer(@AuthenticationPrincipal Jwt jwt) {
		String keycloakUserId = jwt.getSubject();
		CustomerDTO customer = customerService.getCustomerByKeycloakUserId(keycloakUserId);
		return ResponseEntity.ok(customer);
	}

	// Update customer by ID
	@PutMapping("/{id}")
	public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id,
			@Valid @RequestBody CustomerDTO customerDTO) {
		CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);
		return ResponseEntity.ok(updatedCustomer);
	}

	// Delete customer by ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
		customerService.deleteCustomer(id);
		return ResponseEntity.noContent().build();
	}
}
