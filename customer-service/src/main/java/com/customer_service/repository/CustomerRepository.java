package com.customer_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.customer_service.entity.Customer;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	boolean existsByEmail(String email);
	Optional<Customer> findByKeycloakUserId(String keycloakUserId);
}
