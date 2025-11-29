package com.savvasad.apps.repository;

import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.exception.ResourceNotFoundException;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductTypeRepository extends JpaRepository<@NonNull ProductTypeEntity, @NonNull Long> {
    boolean existsByName(String name);

    default ProductTypeEntity findOrThrow(Long id) {
        return findById(id).orElseThrow(() -> new ResourceNotFoundException(
                String.format("ProductType not found: %s", id))
        );
    }
}

