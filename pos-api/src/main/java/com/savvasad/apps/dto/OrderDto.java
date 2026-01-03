package com.savvasad.apps.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Data Transfer Object (DTO) for transferring order data between layers.
 * Validations are applied to ensure data integrity.
 * @param id
 * @param orderValue
 * @param products
 * @param totalOverridden
 * @param paymentMethodId
 * @param comments
 * @param createdAt
 */
public record OrderDto(
        Long id,

        @DecimalMin(value = "0.0", message = "Order value must be greater than zero")
        double orderValue,

        @NotNull(message = "Products list cannot be null")
        @Size(min = 1, message = "Order must contain at least one product")
        List<OrderProductDto> products,

        boolean totalOverridden,

        @NotNull(message = "Payment method ID cannot be null")
        Long paymentMethodId,

        @Size(max = 500, message = "Comments cannot exceed 500 characters")
        String comments,

        LocalDateTime createdAt
) {}
