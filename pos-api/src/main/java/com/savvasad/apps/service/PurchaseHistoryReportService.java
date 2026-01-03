package com.savvasad.apps.service;

import com.savvasad.apps.dto.PurchaseHistoryReportDto;

import java.time.LocalDateTime;
import java.util.List;

public interface PurchaseHistoryReportService {
    List<PurchaseHistoryReportDto> search(LocalDateTime startDate, LocalDateTime endDate, String paymentMethod);
}
