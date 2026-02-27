package com.customer_service.mapper;

import org.springframework.stereotype.Component;

import com.customer_service.dto.CustomerDTO;
import com.customer_service.entity.Customer;

@Component
public class CustomerMapper {

	/**
	 * Convert CustomerDTO to Customer entity
	 */
	public Customer toEntity(CustomerDTO dto) {
		if (dto == null) {
			return null;
		}
		Customer customer = new Customer();
		customer.setId(dto.getId());
		customer.setName(dto.getName());
		customer.setEmail(dto.getEmail());
		customer.setPhoneNumber(dto.getPhoneNumber());
		customer.setAddress(dto.getAddress());
		return customer;
	}

	/**
	 * Convert Customer entity to CustomerDTO
	 */
	public CustomerDTO toDTO(Customer entity) {
		if (entity == null) {
			return null;
		}
		CustomerDTO dto = new CustomerDTO();
		dto.setId(entity.getId());
		dto.setName(entity.getName());
		dto.setEmail(entity.getEmail());
		dto.setPhoneNumber(entity.getPhoneNumber());
		dto.setAddress(entity.getAddress());
		return dto;
	}
}