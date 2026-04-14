package com.savvasad.apps.controller;

import com.savvasad.apps.dto.PurchaseHistoryReportDto;
import com.savvasad.apps.service.PurchaseHistoryReportService;
import org.jspecify.annotations.NonNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reports/purchase-history")
@PreAuthorize("hasRole('ADMIN')")
public class PurchaseHistoryReportController {

    private final PurchaseHistoryReportService purchaseHistoryReportService;

    public PurchaseHistoryReportController(PurchaseHistoryReportService purchaseHistoryReportService) {
        this.purchaseHistoryReportService = purchaseHistoryReportService;
    }

    @GetMapping
    public ResponseEntity<@NonNull List<PurchaseHistoryReportDto>> getPurchaseHistoryReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String paymentMethod
    ) {
        if ((startDate == null) != (endDate == null)) {
            return ResponseEntity.badRequest().body(List.of());
        }

        List<PurchaseHistoryReportDto> reports = purchaseHistoryReportService.search(startDate, endDate, paymentMethod);
        return ResponseEntity.ok(reports);
    }
}
