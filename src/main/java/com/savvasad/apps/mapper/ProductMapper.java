package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.springframework.stereotype.Component;

import static java.util.Objects.nonNull;

@Component
public class ProductMapper {
    private final ProductTypeRepository productTypeRepository;

    public ProductMapper(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    public ProductEntity toEntity(ProductDTO dto) {
        ProductEntity entity = new ProductEntity(
                dto.id(),
                dto.name(),
                dto.retailPrice(),
                dto.wholesalePrice(),
                dto.stockQuantity(),
                dto.description(),
                null
        );

        if (nonNull(dto.productTypeId())) {
            ProductTypeEntity productType = productTypeRepository.findById(dto.productTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("ProductType not found with id: {}" + dto.productTypeId()));
            entity.setProductType(productType);
        }
        return entity;
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