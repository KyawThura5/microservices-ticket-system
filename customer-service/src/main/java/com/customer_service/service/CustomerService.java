package com.customer_service.service;

import java.util.List;

import com.customer_service.dto.CustomerRegistrationRequest;
import com.customer_service.dto.CustomerDTO;

public interface CustomerService {

	CustomerDTO createCustomer(CustomerDTO customerDTO);
	CustomerDTO registerCustomer(CustomerRegistrationRequest request);

	CustomerDTO getCustomerById(Long id);
	CustomerDTO getCustomerByKeycloakUserId(String keycloakUserId);

	List<CustomerDTO> getAllCustomers();

	CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);

	void deleteCustomer(Long id);
}
