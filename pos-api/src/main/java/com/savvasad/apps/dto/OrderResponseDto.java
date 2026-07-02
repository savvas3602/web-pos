package com.savvasad.apps.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDto(
        Long id,
        BigDecimal orderValue,
        String paymentMethod,
        List<OrderItemDto> items,
        boolean totalOverridden,
        String comments,
        LocalDateTime createdAt
) {}
