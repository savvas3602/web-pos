package com.savvasad.apps.service;

import com.savvasad.apps.dto.BrandDTO;
import java.util.List;
import java.util.Optional;

public interface BrandService {
    BrandDTO save(BrandDTO brandDTO);
    Optional<BrandDTO> findById(Long id);
    List<BrandDTO> findAll();
    BrandDTO update(Long id, BrandDTO brandDTO);
    void deleteById(Long id);
}
