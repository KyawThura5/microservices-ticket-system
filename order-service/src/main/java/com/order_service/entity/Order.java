package com.order_service.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.order_service.constant.OrderStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private BigDecimal total;
	private Long quantity;

	@Column(name = "placed_at")
	private LocalDateTime placedAt;

	@Column(name = "customer_id")
	private Long customerId;

	@Column(name = "event_id")
	private Long eventId;

	@Enumerated(EnumType.STRING)
	private OrderStatus status;

	private String failureReason;
}