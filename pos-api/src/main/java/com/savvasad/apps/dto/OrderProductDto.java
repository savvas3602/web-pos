package com.savvasad.apps.dto;

import jakarta.validation.constraints.NotNull;

/**
 * OrderProduct Data Transfer Object (DTO) for transferring order product data between layers.
 * Validations are applied to ensure data integrity.
 * @param productId
 * @param quantity
 */
public record OrderProductDto(
        @NotNull(message = "Product ID cannot be null")
        Long productId,

        @NotNull(message = "Quantity cannot be null")
        int quantity
) {}
