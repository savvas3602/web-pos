package com.savvasad.apps.mapper;
import com.savvasad.apps.dto.PaymentMethodDTO;
import com.savvasad.apps.entity.PaymentMethodEntity;
public class PaymentMethodMapper {
    private PaymentMethodMapper() {}
    public static PaymentMethodDTO toDto(PaymentMethodEntity entity) {
        if (entity == null) return null;
        return new PaymentMethodDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription()
        );
    }
    public static PaymentMethodEntity toEntity(PaymentMethodDTO dto) {
        if (dto == null) return null;
        PaymentMethodEntity entity = new PaymentMethodEntity();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        return entity;
    }
}
