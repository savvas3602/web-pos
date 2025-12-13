package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.exception.DuplicateResourceException;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.mapper.ProductTypeMapper;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductTypeServiceImpl implements ProductTypeService {
    private final ProductTypeRepository productTypeRepository;
    private final ProductTypeMapper productTypeMapper;

    public ProductTypeServiceImpl(ProductTypeRepository productTypeRepository,
                                  ProductTypeMapper productTypeMapper
    ) {
        this.productTypeRepository = productTypeRepository;
        this.productTypeMapper = productTypeMapper;
    }

    @Override
    public ProductTypeDTO save(ProductTypeDTO dto) {
        validateNameNotExists(dto.name());
        ProductTypeEntity entity = productTypeMapper.toEntity(dto);
        return productTypeMapper.toDto(productTypeRepository.save(entity));
    }

    @Override
    public Optional<ProductTypeDTO> findById(Long id) {
        return productTypeRepository.findById(id).map(productTypeMapper::toDto);
    }

    @Override
    public List<ProductTypeDTO> findAll() {
        return productTypeRepository.findAll().stream().map(productTypeMapper::toDto).toList();
    }

    @Override
    public ProductTypeDTO update(Long id, ProductTypeDTO dto) {
        ProductTypeEntity entity = findByIdOrThrow(id);

        // Check if name is being changed to a duplicate (but allow keeping the same name)
        if (!entity.getName().equals(dto.name())) {
            validateNameNotExists(dto.name());
        }

        entity.setName(dto.name());
        entity.setDescription(dto.description());
        return productTypeMapper.toDto(productTypeRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        validateExists(id);
        productTypeRepository.deleteById(id);
    }

    // Private validation methods - business logic belongs in the service layer
    private ProductTypeEntity findByIdOrThrow(Long id) {
        return productTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("ProductType not found: %s", id)
                ));
    }

    private void validateExists(Long id) {
        if (!productTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    String.format("ProductType with id '%d' does not exist.", id)
            );
        }
    }

    private void validateNameNotExists(String name) {
        if (productTypeRepository.existsByName(name)) {
            throw new DuplicateResourceException(
                    String.format("ProductType with name '%s' already exists.", name)
            );
        }
    }
}
