package com.savvasad.apps.repository;

import com.savvasad.apps.entity.OrderEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<@NonNull OrderEntity, @NonNull Long> {
}

