package com.savvasad.apps.repository;

import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.exception.ResourceNotFoundException;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<@NonNull ProductEntity, @NonNull Long> {
    boolean findByName(String name);

    default ProductEntity findOrThrow(Long id) {
        return findById(id).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Product not found: %s", id))
        );
    }
}
