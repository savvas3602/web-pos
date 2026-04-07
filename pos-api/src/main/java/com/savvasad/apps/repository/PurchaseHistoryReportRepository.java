package com.savvasad.apps.repository;

import com.savvasad.apps.entity.PurchaseHistoryReportEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PurchaseHistoryReportRepository
        extends JpaRepository<@NonNull PurchaseHistoryReportEntity, @NonNull Long>,
        JpaSpecificationExecutor<PurchaseHistoryReportEntity> {
}
