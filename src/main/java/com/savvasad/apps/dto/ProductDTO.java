package com.savvasad.apps.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Product Data Transfer Object (DTO) for transferring product data between layers.
 * Validations are applied to ensure data integrity.
 * @param id
 * @param name
 * @param retailPrice
 * @param wholesalePrice
 * @param stockQuantity
 * @param description
 * @param productTypeId
 */
public record ProductDTO(
        Long id,

        @NotBlank(message = "Product name is required")
        String name,

        @NotNull(message = "Retail price is required")
        @DecimalMin(value = "0.01", message = "Retail price must be greater than zero")
        BigDecimal retailPrice,

        @NotNull(message = "Wholesale price is required")
        @DecimalMin(value = "0.01", message = "Wholesale price must be greater than zero")
        BigDecimal wholesalePrice,

        @Min(value = 0, message = "Stock quantity cannot be negative")
        int stockQuantity,

        String description,

        Long productTypeId
) {}