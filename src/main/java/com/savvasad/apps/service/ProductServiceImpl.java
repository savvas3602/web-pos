package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.helper.EntityHelper;
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
        validateNameNotExists(productDTO.name());

        ProductTypeEntity productType = nonNull(productDTO.productTypeId())
                ? findProductTypeByIdOrThrow(productDTO.productTypeId())
                : null;

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
        ProductEntity productEntity = findProductByIdOrThrow(id);

        // If the name is to be updated, ensure that there will be no conflict
        if (!productDTO.name().equals(productEntity.getName())) {
            validateNameNotExists(productDTO.name());
        }

        productEntity.setName(productDTO.name());
        productEntity.setRetailPrice(productDTO.retailPrice());
        productEntity.setWholesalePrice(productDTO.wholesalePrice());
        productEntity.setStockQuantity(productDTO.stockQuantity());
        productEntity.setDescription(productDTO.description());

        productEntity.setProductType(
                nonNull(productDTO.productTypeId())
                        ? findProductTypeByIdOrThrow(productDTO.productTypeId())
                        : null
        );

        return productMapper.toDto(productRepository.save(productEntity));
    }

    @Override
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            EntityHelper.throwResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
    }

    private void validateNameNotExists(String name) {
        if (productRepository.existsByName(name)) {
            EntityHelper.throwDuplicateResourceException("Product", "name", name);
        }
    }

    private ProductEntity findProductByIdOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("Product", id));
    }

    private ProductTypeEntity findProductTypeByIdOrThrow(Long productTypeId) {
        return productTypeRepository.findById(productTypeId)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("Product Type", productTypeId));
    }
}
