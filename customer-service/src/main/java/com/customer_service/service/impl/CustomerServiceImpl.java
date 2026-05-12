package com.customer_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.customer_service.dto.CustomerRegistrationRequest;
import com.customer_service.dto.CustomerDTO;
import com.customer_service.entity.Customer;
import com.customer_service.exception.ConflictException;
import com.customer_service.exception.CustomerRegistrationException;
import com.customer_service.exception.ResourceNotFoundException;
import com.customer_service.mapper.CustomerMapper;
import com.customer_service.repository.CustomerRepository;
import com.customer_service.service.CustomerService;
import com.customer_service.service.keycloak.KeycloakUserProvisioningService;
import com.customer_service.utils.CustomerUtils;

@Service
public class CustomerServiceImpl implements CustomerService {
	private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);

	private final CustomerRepository customerRepository;
	private final CustomerMapper customerMapper;
	private final KeycloakUserProvisioningService keycloakUserProvisioningService;

	public CustomerServiceImpl(CustomerRepository customerRepository, CustomerMapper customerMapper,
			KeycloakUserProvisioningService keycloakUserProvisioningService) {
		this.customerRepository = customerRepository;
		this.customerMapper = customerMapper;
		this.keycloakUserProvisioningService = keycloakUserProvisioningService;
	}

	@Override
	public CustomerDTO createCustomer(CustomerDTO customerDTO) {

		validateCustomer(customerDTO);
		Customer customer = customerMapper.toEntity(customerDTO);
		Customer savedCustomer = customerRepository.save(customer);
		return customerMapper.toDTO(savedCustomer);
	}

	@Override
	@Transactional
	public CustomerDTO registerCustomer(CustomerRegistrationRequest request) {
		if (customerRepository.existsByEmail(request.getEmail())) {
			throw new ConflictException("Email is already registered");
		}

		if (!CustomerUtils.isValidPhoneNumber(request.getPhoneNumber())) {
			throw new IllegalArgumentException("Invalid phone number format");
		}

		String keycloakUserId = keycloakUserProvisioningService.createUser(
				request.getUsername(),
				request.getPassword(),
				request.getEmail(),
				request.getName());
		Customer customer = new Customer();
		customer.setName(request.getName());
		customer.setEmail(request.getEmail());
		customer.setAddress(request.getAddress());
		customer.setPhoneNumber(request.getPhoneNumber());
		customer.setKeycloakUserId(keycloakUserId);

		try {
			Customer savedCustomer = customerRepository.save(customer);
			return customerMapper.toDTO(savedCustomer);
		} catch (DataIntegrityViolationException ex) {
			compensateKeycloakUser(keycloakUserId);
			throw new ConflictException("Customer email or identity already exists");
		} catch (RuntimeException ex) {
			compensateKeycloakUser(keycloakUserId);
			throw new CustomerRegistrationException("Failed to persist customer after Keycloak provisioning", ex);
		}
	}

	@Override
	public CustomerDTO getCustomerById(Long id) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
		return customerMapper.toDTO(customer);
	}

	@Override
	public CustomerDTO getCustomerByKeycloakUserId(String keycloakUserId) {
		Customer customer = customerRepository.findByKeycloakUserId(keycloakUserId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Customer not found with keycloak user id: " + keycloakUserId));
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

		validateCustomer(customerDTO);
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

	private void validateCustomer(CustomerDTO customerDTO) {
		if (!CustomerUtils.isValidEmail(customerDTO.getEmail())) {
			throw new IllegalArgumentException("Invalid email format");
		}

		if (!CustomerUtils.isValidPhoneNumber(customerDTO.getPhoneNumber())) {
			throw new IllegalArgumentException("Invalid phone number format");
		}
	}

	private void compensateKeycloakUser(String keycloakUserId) {
		try {
			keycloakUserProvisioningService.deleteUser(keycloakUserId);
		} catch (RuntimeException ex) {
			log.error("Compensation failed. Could not delete Keycloak user {} after DB failure", keycloakUserId, ex);
		}
	}
}
