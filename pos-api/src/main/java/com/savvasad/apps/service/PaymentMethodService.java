package com.savvasad.apps.service;
import com.savvasad.apps.dto.PaymentMethodDTO;
import java.util.List;
import java.util.Optional;
public interface PaymentMethodService {
    PaymentMethodDTO save(PaymentMethodDTO paymentMethodDTO);
    Optional<PaymentMethodDTO> findById(Long id);
    Optional<PaymentMethodDTO> findByName(String name);
    List<PaymentMethodDTO> findAll();
    PaymentMethodDTO update(Long id, PaymentMethodDTO paymentMethodDTO);
    void deleteById(Long id);
}
