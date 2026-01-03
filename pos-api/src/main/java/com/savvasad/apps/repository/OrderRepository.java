package com.savvasad.apps.repository;

import com.savvasad.apps.entity.OrderEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<@NonNull OrderEntity, @NonNull Long> {

    @Query("SELECT o FROM OrderEntity o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<OrderEntity> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
    List<OrderEntity> findAllOrderByCreatedAtDesc();
}

