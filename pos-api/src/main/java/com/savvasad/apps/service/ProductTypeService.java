package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductTypeDTO;
import java.util.List;
import java.util.Optional;

public interface ProductTypeService {
    ProductTypeDTO save(ProductTypeDTO dto);
    Optional<ProductTypeDTO> findById(Long id);
    List<ProductTypeDTO> findAll();
    ProductTypeDTO update(Long id, ProductTypeDTO dto);
    void deleteById(Long id);
}