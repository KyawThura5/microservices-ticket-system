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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.Map;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    
    @Bean
    public ReactiveJwtAuthenticationConverterAdapter jwtAuthenticationConverter() {

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();

        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Extract roles from realm_access
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            Collection<String> roles = null;
            
            if (realmAccess != null) {
                roles = (Collection<String>) realmAccess.get("roles");
            }
            
            // If no roles found, try to extract from other claims
            if (roles == null || roles.isEmpty()) {
                // Fallback: try to extract from resource_access
                Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
                if (resourceAccess != null) {
                    Map<String, Object> account = (Map<String, Object>) resourceAccess.get("account");
                    if (account != null) {
                        roles = (Collection<String>) account.get("roles");
                    }
                }
            }

            if (roles == null || roles.isEmpty()) {
                return Collections.emptyList();
            }

            return roles.stream()
                    .map(role -> "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        });

        return new ReactiveJwtAuthenticationConverterAdapter(jwtConverter);
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(false);
        corsConfig.addAllowedOrigin("http://localhost:5173");
        corsConfig.addAllowedOrigin("http://localhost:5174");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // Permit OPTIONS requests for CORS preflight
                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Permit all GET requests to /events/** and /venues/**
                .pathMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                .pathMatchers(HttpMethod.GET, "/api/venues/**").permitAll()
                 .pathMatchers("/actuator/health").permitAll()
                
                // Allow unauthenticated customer registration
                .pathMatchers(HttpMethod.POST, "/api/customers/register").permitAll()
                
                // Temporarily allow all customer endpoints for testing
                .pathMatchers("/api/customers/**").permitAll()
                
                // Require CUSTOMER role for /orders/**
                .pathMatchers("/api/orders/**").hasAnyRole("CUSTOMER", "ADMIN")
                
                // Require ADMIN role for management endpoints
                .pathMatchers("/actuator/**").hasRole("ADMIN")

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
}
