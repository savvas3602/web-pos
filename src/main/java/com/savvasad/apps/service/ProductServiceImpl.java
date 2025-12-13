package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.mapper.ProductMapper;
import com.savvasad.apps.repository.ProductRepository;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import static java.util.Objects.nonNull;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductTypeRepository productTypeRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository,
                              ProductTypeRepository productTypeRepository,
                              ProductMapper productMapper
    ) {
        this.productRepository = productRepository;
        this.productTypeRepository = productTypeRepository;
        this.productMapper = productMapper;
    }

    @Override
    public ProductDTO save(ProductDTO productDTO) {
        ProductTypeEntity productType = null;
        if (nonNull(productDTO.productTypeId())) {
            productType = findProductTypeByIdOrThrow(productDTO.productTypeId());
        }

        ProductEntity productEntity = productMapper.toEntity(productDTO, productType);
        return productMapper.toDto(productRepository.save(productEntity));
    }

    @Override
    public Optional<ProductDTO> findById(Long id) {
        return productRepository.findById(id).map(productMapper::toDto);
    }

    @Override
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream().map(productMapper::toDto).toList();
    }

    @Override
    public ProductDTO update(Long id, ProductDTO productDTO) {
        ProductEntity productEntity = findByIdOrThrow(id);

        productEntity.setName(productDTO.name());
        productEntity.setRetailPrice(productDTO.retailPrice());
        productEntity.setWholesalePrice(productDTO.wholesalePrice());
        productEntity.setStockQuantity(productDTO.stockQuantity());
        productEntity.setDescription(productDTO.description());

        if (nonNull(productDTO.productTypeId())) {
            ProductTypeEntity productType = findProductTypeByIdOrThrow(productDTO.productTypeId());
            productEntity.setProductType(productType);
        } else {
            productEntity.setProductType(null);
        }

        return productMapper.toDto(productRepository.save(productEntity));
    }

    @Override
    public void deleteById(Long id) {
        validateExists(id);
        productRepository.deleteById(id);
    }

    private void validateExists(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    String.format("Product with id '%d' does not exist.", id)
            );
        }
    }

    private ProductEntity findByIdOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Product not found: %s", id)
                ));
    }

    private ProductTypeEntity findProductTypeByIdOrThrow(Long id) {
        return productTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("ProductType not found: %s", id)
                ));
    }
}
