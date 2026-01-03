package com.savvasad.apps.repository;

import com.savvasad.apps.entity.OrderProductEntity;
import com.savvasad.apps.entity.keys.OrderProductKey;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductRepository extends JpaRepository<@NonNull OrderProductEntity, @NonNull OrderProductKey> {
}
