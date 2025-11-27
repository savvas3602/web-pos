package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    private final ProductTypeRepository productTypeRepository;

    public ProductMapper(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    public ProductEntity dtoToEntity(ProductDTO productDTO) {

        ProductTypeEntity productType = productTypeRepository.findById(productDTO.productTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductType id not found: " + productDTO.productTypeId()));

        return new ProductEntity(
                productDTO.id(),
                productDTO.name(),
                productDTO.retailPrice(),
                productDTO.wholesalePrice(),
                productDTO.stockQuantity(),
                productDTO.description(),
                productType
        );
    }

    public static ProductDTO entityToDTO(ProductEntity productEntity) {
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