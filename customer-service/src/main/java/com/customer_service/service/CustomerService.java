package com.customer_service.service;

import java.util.List;

import com.customer_service.dto.CustomerDTO;

public interface CustomerService {

	CustomerDTO createCustomer(CustomerDTO customerDTO);

	CustomerDTO getCustomerById(Long id);

	List<CustomerDTO> getAllCustomers();

	CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);

	void deleteCustomer(Long id);
}