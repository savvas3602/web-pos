package com.savvasad.apps.repository;

import com.savvasad.apps.entity.PurchaseHistoryReportEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PurchaseHistoryReportRepository extends JpaRepository<@NonNull PurchaseHistoryReportEntity, @NonNull Long> {

    @Query(
            "SELECT p FROM PurchaseHistoryReportEntity p " +
            "WHERE (:startDate IS NULL OR p.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR p.createdAt <= :endDate) " +
            "AND (:paymentMethod IS NULL OR :paymentMethod = '' OR p.paymentMethod = :paymentMethod) " +
            "ORDER BY p.createdAt DESC"
    )
    List<PurchaseHistoryReportEntity> search(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("paymentMethod") String paymentMethod
    );
}
