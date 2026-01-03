package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.helper.EntityHelper;
import com.savvasad.apps.mapper.ProductTypeMapper;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductTypeServiceImpl implements ProductTypeService {
    private final ProductTypeRepository productTypeRepository;
    private final ProductTypeMapper productTypeMapper;

    public ProductTypeServiceImpl(ProductTypeRepository productTypeRepository, ProductTypeMapper productTypeMapper) {
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
        ProductTypeEntity entity = productTypeRepository.findById(id)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("Product Type", id));

        if (!entity.getName().equals(dto.name())) {
            validateNameNotExists(dto.name());
        }

        entity.setName(dto.name());
        entity.setDescription(dto.description());
        return productTypeMapper.toDto(productTypeRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        if (!productTypeRepository.existsById(id)) {
            EntityHelper.throwResourceNotFoundException("Product Type", id);
        }
        productTypeRepository.deleteById(id);
    }

    private void validateNameNotExists(String name) {
        if (productTypeRepository.existsByName(name)) {
            EntityHelper.throwDuplicateResourceException("Product Type", "name", name);
        }
    }
}
