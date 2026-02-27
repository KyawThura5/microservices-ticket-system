package com.customer_service.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.customer_service.dto.CustomerDTO;
import com.customer_service.entity.Customer;
import com.customer_service.mapper.CustomerMapper;
import com.customer_service.repository.CustomerRepository;
import com.customer_service.service.CustomerService;
import com.customer_service.utils.CustomerUtils;

@Service
public class CustomerServiceImpl implements CustomerService {

	private final CustomerRepository customerRepository;
	private final CustomerMapper customerMapper;

	public CustomerServiceImpl(CustomerRepository customerRepository, CustomerMapper customerMapper) {
		this.customerRepository = customerRepository;
		this.customerMapper = customerMapper;
	}

	@Override
	public CustomerDTO createCustomer(CustomerDTO customerDTO) {

		if (!CustomerUtils.isValidEmail(customerDTO.getEmail())) {
			throw new IllegalArgumentException("Invalid email format");
		}

		if (!CustomerUtils.isValidPhoneNumber(customerDTO.getPhoneNumber())) {
			throw new IllegalArgumentException("Invalid phone number format");
		}
		Customer customer = customerMapper.toEntity(customerDTO);
		Customer savedCustomer = customerRepository.save(customer);
		return customerMapper.toDTO(savedCustomer);
	}

	@Override
	public CustomerDTO getCustomerById(Long id) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
		return customerMapper.toDTO(customer);
	}

	@Override
	public List<CustomerDTO> getAllCustomers() {
		return customerRepository.findAll().stream().map(customerMapper::toDTO).collect(Collectors.toList());
	}

	@Override
	public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
		Customer existingCustomer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

		if (!CustomerUtils.isValidEmail(customerDTO.getEmail())) {
			throw new IllegalArgumentException("Invalid email format");
		}

		if (!CustomerUtils.isValidPhoneNumber(customerDTO.getPhoneNumber())) {
			throw new IllegalArgumentException("Invalid phone number format");
		}
		existingCustomer.setName(customerDTO.getName());
		existingCustomer.setEmail(customerDTO.getEmail());
		existingCustomer.setAddress(customerDTO.getAddress());
		existingCustomer.setPhoneNumber(customerDTO.getPhoneNumber());

		Customer updatedCustomer = customerRepository.save(existingCustomer);
		return customerMapper.toDTO(updatedCustomer);
	}

	@Override
	public void deleteCustomer(Long id) {
		Customer existingCustomer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
		customerRepository.delete(existingCustomer);
	}
}