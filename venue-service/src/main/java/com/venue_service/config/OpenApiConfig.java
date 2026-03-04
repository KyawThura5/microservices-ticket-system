package com.venue_service.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI().servers(List.of(
				// This is the CRITICAL part.
				// By setting the URL to "/", we tell Swagger to use
				// the current host and port (the Gateway) for all requests.
				new Server().url("/").description("Default Gateway Server")));
	}
}
