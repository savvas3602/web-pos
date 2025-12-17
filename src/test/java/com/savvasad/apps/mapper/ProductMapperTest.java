package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.entity.ProductTypeEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
class ProductMapperTest {

    @Autowired
    ProductMapper productMapper;

    @Test
    void testToEntity() {
        ProductTypeEntity productTypeEntity = new ProductTypeEntity(1L, "Type1", "Description1");
        ProductDTO dto = new ProductDTO(
                1L, "Product1", BigDecimal.valueOf(100), BigDecimal.valueOf(200), 50, "Description1", 1L
        );

        ProductEntity entity = productMapper.toEntity(dto, productTypeEntity);
        assertThat(entity.getName()).isEqualTo("Product1");
        assertThat(entity.getProductType().getId()).isEqualTo(1L);
    }

    @Test
    void testToDto() {
        ProductTypeEntity productTypeEntity = new ProductTypeEntity(1L, "Type1", "Description1");
        ProductEntity productEntity = new ProductEntity(
                1L, "Product1", BigDecimal.valueOf(100), BigDecimal.valueOf(200), 50, "Description1", productTypeEntity
        );

        ProductDTO dto = productMapper.toDto(productEntity);
        assertThat(dto.name()).isEqualTo("Product1");
        assertThat(dto.productTypeId()).isEqualTo(1L);
    }
}