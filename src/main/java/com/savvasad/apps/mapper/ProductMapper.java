package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    public ProductEntity toEntity(ProductDTO dto, ProductTypeEntity productType) {
        return new ProductEntity(
                dto.id(),
                dto.name(),
                dto.retailPrice(),
                dto.wholesalePrice(),
                dto.stockQuantity(),
                dto.description(),
                productType
        );
    }

    public ProductDTO toDto(ProductEntity productEntity) {
        return new ProductDTO(
                productEntity.getId(),
                productEntity.getName(),
                productEntity.getRetailPrice(),
                productEntity.getWholesalePrice(),
                productEntity.getStockQuantity(),
                productEntity.getDescription(),
                productEntity.getProductType() != null ? productEntity.getProductType().getId() : null
        );
    }
}