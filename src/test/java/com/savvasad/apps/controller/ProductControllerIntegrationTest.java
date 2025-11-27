package com.savvasad.apps.controller;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.mapper.ProductMapper;
import com.savvasad.apps.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.RestTestClient;
import org.springframework.test.web.servlet.client.RestTestClient;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private static final Supplier<ProductDTO> TEST_PRODUCT = () -> new ProductDTO(
            null,
            "Integration Test",
            new BigDecimal("99.99"),
            new BigDecimal("79.99"),
            50,
            "Integration Test Product",
            null
    );

    @BeforeEach
    void setup() {
        productRepository.deleteAll(); // Clean state
    }

    @Test
    void testCreateProduct() throws Exception {
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(TEST_PRODUCT.get())))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Integration Test"));
    }

    @Test
    void testGetProduct() throws Exception {
        ProductEntity saved = productRepository.save(productMapper.dtoToEntity(TEST_PRODUCT.get()));
        mockMvc.perform(get("/products/" + saved.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.name").value("Integration Test"));
    }

    @Test
    void testDeleteProduct() throws Exception {
        ProductEntity saved = productRepository.save(productMapper.dtoToEntity(TEST_PRODUCT.get()));
        mockMvc.perform(delete("/products/" + saved.getId()))
                .andDo(print())
                .andExpect(status().isNoContent());
        assertThat(productRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    void testUpdateProduct() throws Exception {
        ProductEntity saved = productRepository.save(productMapper.dtoToEntity(TEST_PRODUCT.get()));
        ProductDTO update = new ProductDTO(null, "Updated Name", new BigDecimal("88.88"), new BigDecimal("77.77"), 60, "Updated Desc", null);
        mockMvc.perform(put("/products/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.retailPrice").value(88.88))
                .andExpect(jsonPath("$.description").value("Updated Desc"));
    }

    @Test
    void testGetProduct_NotFound() throws Exception {
        mockMvc.perform(get("/products/99999"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteProduct_NotFound() throws Exception {
        mockMvc.perform(delete("/products/99999"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateProduct_InvalidInput() throws Exception {
        ProductDTO invalid = new ProductDTO(null, "", null, null, -1, "", null);
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}