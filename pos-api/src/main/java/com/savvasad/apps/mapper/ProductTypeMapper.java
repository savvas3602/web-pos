package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.entity.ProductTypeEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductTypeMapper {
    public ProductTypeEntity toEntity(ProductTypeDTO dto) {
        return new ProductTypeEntity(
            dto.id(),
            dto.name(),
            dto.description()
        );
    }

    public ProductTypeDTO toDto(ProductTypeEntity entity) {
        return new ProductTypeDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription()
        );
    }
}
