package com.savvasad.apps.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Order Data Transfer Object (DTO) for transferring order data between layers.
 * Validations are applied to ensure data integrity.
 * @param id
 * @param orderValue
 * @param products
 */
public record OrderDto(
        Long id,

        @DecimalMin(value = "0.0", message = "Order value must be greater than zero")
        double orderValue,

        @NotNull(message = "Products list cannot be null")
        @Size(min = 1, message = "Order must contain at least one product")
        List<OrderProductDto> products
) {}
