package com.savvasad.apps.service;

import com.savvasad.apps.dto.OrderDto;
import com.savvasad.apps.dto.OrderResponseDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    OrderDto save(OrderDto orderDto);
    Optional<OrderResponseDto> findById(Long id);
    List<OrderResponseDto> findAll();
    List<OrderResponseDto> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    void delete(Long id);
}

