package com.savvasad.apps.service;

import com.savvasad.apps.dto.OrderDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    OrderDto save(OrderDto orderDto);
    Optional<OrderDto> findById(Long id);
    List<OrderDto> findAll();
    List<OrderDto> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    void delete(Long id);
}

