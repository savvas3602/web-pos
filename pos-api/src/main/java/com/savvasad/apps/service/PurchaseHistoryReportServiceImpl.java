package com.savvasad.apps.service;

import com.savvasad.apps.dto.PurchaseHistoryReportDto;
import com.savvasad.apps.entity.PurchaseHistoryReportEntity;
import com.savvasad.apps.mapper.PurchaseHistoryReportMapper;
import com.savvasad.apps.repository.PurchaseHistoryReportRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
        Specification<PurchaseHistoryReportEntity> spec = (_, _, cb) -> cb.conjunction();

        if (startDate != null) {
            spec = spec.and((root, _, cb) ->
                    cb.greaterThanOrEqualTo(root.get("createdAt"), startDate)
            );
        }

        if (endDate != null) {
            spec = spec.and((root, _, cb) ->
                    cb.lessThanOrEqualTo(root.get("createdAt"), endDate)
            );
        }

        if (StringUtils.hasText(normalizedPaymentMethod)) {
            spec = spec.and((root, _, cb) ->
                    cb.equal(root.get("paymentMethod"), normalizedPaymentMethod)
            );
        }

        return purchaseHistoryReportRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(purchaseHistoryReportMapper::toDto)
                .toList();
    }
}
