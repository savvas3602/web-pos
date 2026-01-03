package com.savvasad.apps.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Purchase History Report Data Transfer Object (DTO)
 * Represents a single purchase record with aggregated order and product information.
 * @param id Order ID
 * @param createdAt Order creation timestamp
 * @param orderValue Total order value
 * @param comments Order comments
 * @param paymentMethod Payment method name
 * @param totalOverridden Whether the total was overridden
 * @param totalItems Total quantity of items in the order
 * @param items Comma-separated list of products with quantities
 */
public record PurchaseHistoryReportDto(
        Long id,
        LocalDateTime createdAt,
        BigDecimal orderValue,
        String comments,
        String paymentMethod,
        Boolean totalOverridden,
        Integer totalItems,
        String items
) {}


