package com.savvasad.apps.dto;

import java.math.BigDecimal;

public record OrderItemDto(
        String productName,
        BigDecimal retailPrice,
        int quantity
) {}
