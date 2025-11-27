package com.savvasad.apps.repository;

import com.savvasad.apps.entity.ProductTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductTypeEntity, Long> {
    boolean existsByName(String name);
}

