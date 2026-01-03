package com.savvasad.apps.repository;

import com.savvasad.apps.entity.ProductEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<@NonNull ProductEntity, @NonNull Long> {
    boolean existsByName(String name);
}
