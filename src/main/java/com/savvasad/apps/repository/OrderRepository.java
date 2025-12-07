package com.savvasad.apps.repository;

import com.savvasad.apps.entity.OrderEntity;
import com.savvasad.apps.exception.ResourceNotFoundException;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<@NonNull OrderEntity, @NonNull Long> {
    default OrderEntity findOrThrow(Long id) {
        return findById(id).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Order not found: %s", id))
        );
    }
}

