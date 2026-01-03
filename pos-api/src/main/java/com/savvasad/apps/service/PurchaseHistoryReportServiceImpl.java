package com.savvasad.apps.service;

import com.savvasad.apps.dto.PurchaseHistoryReportDto;
import com.savvasad.apps.mapper.PurchaseHistoryReportMapper;
import com.savvasad.apps.repository.PurchaseHistoryReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseHistoryReportServiceImpl implements PurchaseHistoryReportService {

    private final PurchaseHistoryReportRepository purchaseHistoryReportRepository;
    private final PurchaseHistoryReportMapper purchaseHistoryReportMapper;

    public PurchaseHistoryReportServiceImpl(
            PurchaseHistoryReportRepository purchaseHistoryReportRepository,
            PurchaseHistoryReportMapper purchaseHistoryReportMapper
    ) {
        this.purchaseHistoryReportRepository = purchaseHistoryReportRepository;
        this.purchaseHistoryReportMapper = purchaseHistoryReportMapper;
    }

    @Override
    public List<PurchaseHistoryReportDto> search(LocalDateTime startDate, LocalDateTime endDate, String paymentMethod) {
        String normalizedPaymentMethod = paymentMethod == null ? null : paymentMethod.trim();

        return purchaseHistoryReportRepository.search(startDate, endDate, normalizedPaymentMethod)
                .stream()
                .map(purchaseHistoryReportMapper::toDto)
                .toList();
    }
}
