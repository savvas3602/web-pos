package com.savvasad.apps.controller;

import com.savvasad.apps.dto.OrderDto;
import com.savvasad.apps.service.OrderService;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('ROLE_USER')")
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<@NonNull OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.save(orderDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NonNull OrderDto> getOrder(@PathVariable Long id) {
        return orderService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<@NonNull List<OrderDto>> getAllOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(orderService.findByDateRange(startDate, endDate));
        }
        return ResponseEntity.ok(orderService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}