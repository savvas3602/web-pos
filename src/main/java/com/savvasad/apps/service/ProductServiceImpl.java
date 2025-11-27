package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.repository.ProductRepository;
import com.savvasad.apps.repository.ProductTypeRepository;
import com.savvasad.apps.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import static java.util.Objects.nonNull;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductTypeRepository productTypeRepository;

    public ProductServiceImpl(ProductRepository productRepository, ProductTypeRepository productTypeRepository) {
        this.productRepository = productRepository;
        this.productTypeRepository = productTypeRepository;
    }

    private ProductDTO mapToDTO(ProductEntity productEntity) {
        Long productTypeId = nonNull(productEntity.getProductType()) ? productEntity.getProductType().getId() : null;
        return new ProductDTO(
                productEntity.getId(),
                productEntity.getName(),
                productEntity.getRetailPrice(),
                productEntity.getWholesalePrice(),
                productEntity.getStockQuantity(),
                productEntity.getDescription(),
                productTypeId
        );
    }

    private ProductEntity mapToEntity(ProductDTO dto) {
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
                .orElseThrow(() -> new ResourceNotFoundException("ProductType not found with id: " + dto.productTypeId()));
            entity.setProductType(productType);
        }
        return entity;
    }

    @Override
    public ProductDTO save(ProductDTO productDTO) {
        ProductEntity productEntity = mapToEntity(productDTO);
        return mapToDTO(productRepository.save(productEntity));
    }

    @Override
    public Optional<ProductDTO> findById(Long id) {
        return productRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Override
    public ProductDTO update(Long id, ProductDTO productDTO) {
        ProductEntity productEntity = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        productEntity.setName(productDTO.name());
        productEntity.setRetailPrice(productDTO.retailPrice());
        productEntity.setWholesalePrice(productDTO.wholesalePrice());
        productEntity.setStockQuantity(productDTO.stockQuantity());
        productEntity.setDescription(productDTO.description());

        if (nonNull(productDTO.productTypeId())) {
            ProductTypeEntity productType = productTypeRepository.findById(productDTO.productTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductType not found with id: " + productDTO.productTypeId()));
            productEntity.setProductType(productType);
        } else {
            productEntity.setProductType(null);
        }

        return mapToDTO(productRepository.save(productEntity));
    }

    @Override
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
