package com.savvasad.apps.service;

import com.savvasad.apps.dto.BrandDTO;
import com.savvasad.apps.entity.BrandEntity;
import com.savvasad.apps.exception.DuplicateResourceException;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.mapper.BrandMapper;
import com.savvasad.apps.repository.BrandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public BrandDTO save(BrandDTO brandDTO) {
        validateNameNotExists(brandDTO.name());

        BrandEntity entity = BrandMapper.toEntity(brandDTO);
        return BrandMapper.toDto(brandRepository.save(entity));
    }

    @Override
    public Optional<BrandDTO> findById(Long id) {
        return brandRepository.findById(id).map(BrandMapper::toDto);
    }

    @Override
    public List<BrandDTO> findAll() {
        return brandRepository.findAll().stream()
                .map(BrandMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDTO update(Long id, BrandDTO brandDTO) {
        BrandEntity entity = findByIdOrThrow(id);
        validateNameNotExists(brandDTO.name());

        entity.setName(brandDTO.name());
        entity.setDescription(brandDTO.description());
        return BrandMapper.toDto(brandRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        validateExists(id);
        brandRepository.deleteById(id);
    }

    // Private validation methods - business logic belongs in the service layer
    private BrandEntity findByIdOrThrow(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Brand not found: %s", id)
                ));
    }

    private void validateExists(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    String.format("Brand with id '%d' does not exist.", id)
            );
        }
    }

    private void validateNameNotExists(String name) {
        if (brandRepository.existsByName(name)) {
            throw new DuplicateResourceException(
                    String.format("Brand with name '%s' already exists.", name)
            );
        }
    }
}
