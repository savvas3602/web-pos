package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductDTO;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    ProductDTO save(ProductDTO productDTO);
    Optional<ProductDTO> findById(Long id);
    List<ProductDTO> findAll();
    ProductDTO update(Long id, ProductDTO productDTO);
    void deleteById(Long id);
}