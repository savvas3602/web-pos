package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.PurchaseHistoryReportDto;
import com.savvasad.apps.entity.PurchaseHistoryReportEntity;
import org.springframework.stereotype.Component;

@Component
public class PurchaseHistoryReportMapper {
    public PurchaseHistoryReportDto toDto(PurchaseHistoryReportEntity entity) {
        return new PurchaseHistoryReportDto(
                entity.getId(),
                entity.getCreatedAt(),
                entity.getOrderValue(),
                entity.getComments(),
                entity.getPaymentMethod(),
                entity.getTotalOverridden(),
                entity.getTotalItems(),
                entity.getItems()
        );
    }
}

