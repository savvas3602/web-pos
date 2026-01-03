package com.savvasad.apps.service;
import com.savvasad.apps.dto.PaymentMethodDTO;
import com.savvasad.apps.entity.PaymentMethodEntity;
import com.savvasad.apps.helper.EntityHelper;
import com.savvasad.apps.mapper.PaymentMethodMapper;
import com.savvasad.apps.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
@Service
@Transactional
public class PaymentMethodServiceImpl implements PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    public PaymentMethodServiceImpl(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }
    @Override
    public PaymentMethodDTO save(PaymentMethodDTO paymentMethodDTO) {
        validateNameNotExists(paymentMethodDTO.name());
        PaymentMethodEntity entity = PaymentMethodMapper.toEntity(paymentMethodDTO);
        return PaymentMethodMapper.toDto(paymentMethodRepository.save(entity));
    }
    @Override
    public Optional<PaymentMethodDTO> findById(Long id) {
        return paymentMethodRepository.findById(id).map(PaymentMethodMapper::toDto);
    }
    @Override
    public Optional<PaymentMethodDTO> findByName(String name) {
        return paymentMethodRepository.findByName(name).map(PaymentMethodMapper::toDto);
    }
    @Override
    public List<PaymentMethodDTO> findAll() {
        return paymentMethodRepository.findAll().stream()
                .map(PaymentMethodMapper::toDto)
                .toList();
    }
    @Override
    public PaymentMethodDTO update(Long id, PaymentMethodDTO paymentMethodDTO) {
        PaymentMethodEntity entity = findPaymentMethodByIdOrThrow(id);
        if (!entity.getName().equals(paymentMethodDTO.name())) {
            validateNameNotExists(paymentMethodDTO.name());
        }
        entity.setName(paymentMethodDTO.name());
        entity.setDescription(paymentMethodDTO.description());
        return PaymentMethodMapper.toDto(paymentMethodRepository.save(entity));
    }
    @Override
    public void deleteById(Long id) {
        if (!paymentMethodRepository.existsById(id)) {
            EntityHelper.throwResourceNotFoundException("PaymentMethod", id);
        }
        paymentMethodRepository.deleteById(id);
    }
    private PaymentMethodEntity findPaymentMethodByIdOrThrow(Long id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("PaymentMethod", id));
    }
    private void validateNameNotExists(String name) {
        if (paymentMethodRepository.existsByName(name)) {
            EntityHelper.throwDuplicateResourceException("PaymentMethod", "name", name);
        }
    }
}
