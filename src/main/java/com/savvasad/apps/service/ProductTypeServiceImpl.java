package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.exception.DuplicateResourceException;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductTypeServiceImpl implements ProductTypeService {
    private final ProductTypeRepository productTypeRepository;

    public ProductTypeServiceImpl(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    private ProductTypeDTO toDTO(ProductTypeEntity entity) {
        return new ProductTypeDTO(entity.getId(), entity.getName(), entity.getDescription());
    }

    private ProductTypeEntity toEntity(ProductTypeDTO dto) {
        return new ProductTypeEntity(dto.id(), dto.name(), dto.description());
    }

    @Override
    public ProductTypeDTO save(ProductTypeDTO dto) {
        if (productTypeRepository.existsByName(dto.name())) {
            throw new DuplicateResourceException("ProductType with name '" + dto.name() + "' already exists");
        }
        ProductTypeEntity entity = toEntity(dto);
        return toDTO(productTypeRepository.save(entity));
    }

    @Override
    public Optional<ProductTypeDTO> findById(Long id) {
        return productTypeRepository.findById(id).map(this::toDTO);
    }

    @Override
    public List<ProductTypeDTO> findAll() {
        return productTypeRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public ProductTypeDTO update(Long id, ProductTypeDTO dto) {
        ProductTypeEntity entity = productTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductType not found with id: " + id));

        // Check if name is being changed to a duplicate (but allow keeping the same name)
        if (!entity.getName().equals(dto.name()) && productTypeRepository.existsByName(dto.name())) {
            throw new DuplicateResourceException("ProductType with name '" + dto.name() + "' already exists");
        }

        entity.setName(dto.name());
        entity.setDescription(dto.description());
        return toDTO(productTypeRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        if (!productTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProductType not found with id: " + id);
        }
        productTypeRepository.deleteById(id);
    }
}
