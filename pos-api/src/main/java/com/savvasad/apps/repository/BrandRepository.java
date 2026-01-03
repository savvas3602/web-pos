package com.savvasad.apps.repository;

import com.savvasad.apps.entity.BrandEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrandRepository extends JpaRepository<@NonNull BrandEntity, @NonNull Long> {
    Optional<BrandEntity> findByName(String name);
    boolean existsByName(String name);
}
