package com.savvasad.apps.controller;
import com.savvasad.apps.dto.PaymentMethodDTO;
import com.savvasad.apps.service.PaymentMethodService;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/payment-methods")
@PreAuthorize("hasRole('ROLE_USER')")
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;
    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }
    @PostMapping
    public ResponseEntity<@NonNull PaymentMethodDTO> createPaymentMethod(@Valid @RequestBody PaymentMethodDTO paymentMethodDTO) {
        return ResponseEntity.ok(paymentMethodService.save(paymentMethodDTO));
    }
    @GetMapping("/{id}")
    public ResponseEntity<@NonNull PaymentMethodDTO> getPaymentMethod(@PathVariable Long id) {
        return paymentMethodService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping
    public ResponseEntity<@NonNull List<PaymentMethodDTO>> getAllPaymentMethods() {
        return ResponseEntity.ok(paymentMethodService.findAll());
    }
    @PutMapping("/{id}")
    public ResponseEntity<@NonNull PaymentMethodDTO> updatePaymentMethod(@PathVariable Long id, @Valid @RequestBody PaymentMethodDTO paymentMethodDTO) {
        return ResponseEntity.ok(paymentMethodService.update(id, paymentMethodDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
