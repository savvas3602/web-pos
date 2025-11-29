package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.mapper.ProductMapper;
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
        ProductEntity productEntity = productMapper.toEntity(productDTO);
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

        return productMapper.toDto(productRepository.save(productEntity));
    }

    @Override
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
