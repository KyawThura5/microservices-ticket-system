package com.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // Permit all GET requests to /events/** and /venues/**
                .pathMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                .pathMatchers(HttpMethod.GET, "/api/venues/**").permitAll()
                 .pathMatchers("/actuator/health").permitAll()
                
                // Require CUSTOMER role for /orders/**
                .pathMatchers("/api/orders/**").hasAnyRole("CUSTOMER", "ADMIN")
                
                // Require ADMIN role for management endpoints
                .pathMatchers("/actuator/**").hasRole("ADMIN")
                 .pathMatchers("/api/customers/**").hasRole("ADMIN")

                .pathMatchers(HttpMethod.POST, "/api/events/**").hasRole("ADMIN")
                .pathMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ADMIN")
                .pathMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN")

                .pathMatchers(HttpMethod.POST, "/api/venues/**").hasRole("ADMIN")
                 .pathMatchers(HttpMethod.PUT, "/api/venues/**").hasRole("ADMIN")
                 .pathMatchers(HttpMethod.DELETE, "/api/venues/**").hasRole("ADMIN")
                
                // All other requests need to be authenticated
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .build();
    }

    @Bean
    public ReactiveJwtAuthenticationConverterAdapter jwtAuthenticationConverter() {

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();

        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> {

            Map<String, Object> realmAccess =
                    jwt.getClaimAsMap("realm_access");

            Collection<String> roles =
                    (Collection<String>) realmAccess.get("roles");

            return roles.stream()
                    .map(role -> "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        });

        return new ReactiveJwtAuthenticationConverterAdapter(jwtConverter);
    }
}
