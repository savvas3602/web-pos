package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.BrandDTO;
import com.savvasad.apps.entity.BrandEntity;

public class BrandMapper {
    private BrandMapper() {}

    public static BrandDTO toDto(BrandEntity entity) {
        if (entity == null) return null;

        return new BrandDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription()
        );
    }

    public static BrandEntity toEntity(BrandDTO dto) {
        if (dto == null) return null;

        BrandEntity entity = new BrandEntity();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        return entity;
    }
}
