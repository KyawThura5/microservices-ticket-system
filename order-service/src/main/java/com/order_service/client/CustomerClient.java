package com.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.order_service.dto.CustomerResponseDto;

@FeignClient(name = "customer-service")
public interface CustomerClient {
	@GetMapping("/api/customers/me")
	CustomerResponseDto getCurrentCustomer(@RequestHeader("Authorization") String authorizationHeader);
}
