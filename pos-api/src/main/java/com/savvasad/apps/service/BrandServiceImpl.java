package com.savvasad.apps.service;

import com.savvasad.apps.dto.BrandDTO;
import com.savvasad.apps.entity.BrandEntity;
import com.savvasad.apps.helper.EntityHelper;
import com.savvasad.apps.mapper.BrandMapper;
import com.savvasad.apps.repository.BrandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
                .toList();
    }

    @Override
    public BrandDTO update(Long id, BrandDTO brandDTO) {
        BrandEntity entity = findBrandByIdOrThrow(id);

        if (!entity.getName().equals(brandDTO.name())) {
            validateNameNotExists(brandDTO.name());
        }

        entity.setName(brandDTO.name());
        entity.setDescription(brandDTO.description());
        return BrandMapper.toDto(brandRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        if (!brandRepository.existsById(id)) {
            EntityHelper.throwResourceNotFoundException("Brand", id);
        }
        brandRepository.deleteById(id);
    }

    private BrandEntity findBrandByIdOrThrow(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("Brand", id));
    }

    private void validateNameNotExists(String name) {
        if (brandRepository.existsByName(name)) {
            EntityHelper.throwDuplicateResourceException("Brand", "name", name);
        }
    }
}
