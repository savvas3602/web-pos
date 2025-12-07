package com.savvasad.apps.controller;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.exception.DuplicateResourceException;
import com.savvasad.apps.exception.GlobalExceptionHandler;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {
    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testFindAll() throws Exception {
        when(productService.findAll())
                .thenReturn(List.of(new ProductDTO(
                        1L, "Test", BigDecimal.ONE, BigDecimal.TEN, 100, "desc", 1L
                )));

        mockMvc.perform(get("/products"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test"))
                .andExpect(jsonPath("$[0].description").value("desc"));
    }

    @Test
    void testGetById() throws Exception {
        when(productService.findById(1L))
                .thenReturn(Optional.of(new ProductDTO(
                        1L, "Test", BigDecimal.TEN, BigDecimal.TWO, 100, "desc", 1L
                )));

        mockMvc.perform(get("/products/1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test"))
                .andExpect(jsonPath("$.description").value("desc"));
    }

    // HTTP 404 Not Found
    @Test
    void testGetById_NotFound() throws Exception {
        when(productService.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/products/99"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    // HTTP 201 Created
    @Test
    void testCreateProduct() throws Exception {
        when(productService.save(any(ProductDTO.class)))
                .thenReturn(new ProductDTO(2L, "New", BigDecimal.TEN, BigDecimal.ONE, 50, "desc new", 1L));

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"New\",\"retailPrice\":10.0,\"wholesalePrice\":1.0,\"stockQuantity\":1,\"description\":\"desc new\"}"))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.description").value("desc new"));
    }

    // HTTP 409 Conflict
    @Test
    void testCreateExistingProduct() throws Exception {
        when(productService.save(any(ProductDTO.class)))
                .thenThrow(new DuplicateResourceException("Product with ID already exists"));

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"name\":\"Existing\",\"retailPrice\":10.0,\"wholesalePrice\":1.0,\"stockQuantity\":50,\"description\":\"desc existing\"}"))
                .andDo(print())
                .andExpect(status().isConflict());
    }

    // HTTP 400 Bad Request
    @Test
    void testCreateProduct_InvalidInput() throws Exception {
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"retailPrice\":0.0,\"wholesalePrice\":-1.0,\"stockQuantity\":-10,\"description\":\"desc invalid\"}"))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // HTTP 200 OK
    @Test
    void testUpdate() throws Exception {
        when(productService.update(eq(1L), any(ProductDTO.class)))
                .thenReturn(new ProductDTO(
                        1L, "Updated", BigDecimal.TEN, BigDecimal.TEN, 60, "desc updated", 1L
                ));

        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Updated\",\"retailPrice\":10.0,\"wholesalePrice\":10.0,\"stockQuantity\":60,\"description\":\"desc updated\", \"product_type_id\":1}"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"))
                .andExpect(jsonPath("$.retailPrice").value(10.0))
                .andExpect(jsonPath("$.wholesalePrice").value(10.0))
                .andExpect(jsonPath("$.stockQuantity").value(60))
                .andExpect(jsonPath("$.description").value("desc updated"))
                .andExpect(jsonPath("$.productTypeId").value(1L));
    }

    // HTTP 404 Not Found
    @Test
    void testUpdate_NotFound() throws Exception {
        when(productService.update(eq(99L), any(ProductDTO.class)))
                .thenThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(put("/products/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"NonExistent\",\"retailPrice\":10.0,\"wholesalePrice\":1.0,\"stockQuantity\":50,\"description\":\"desc non-existent\"}"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    // HTTP 409 Conflict
    @Test
    void testUpdate_Duplicate() throws Exception {
        when(productService.update(eq(1L), any(ProductDTO.class)))
                .thenThrow(new DuplicateResourceException("Product with ID already exists"));

        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Duplicate\",\"retailPrice\":10.0,\"wholesalePrice\":1.0,\"stockQuantity\":50,\"description\":\"desc duplicate\"}"))
                .andDo(print())
                .andExpect(status().isConflict());
    }

    // HTTP 400 Bad Request
    @Test
    void testUpdate_InvalidInput() throws Exception {
        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"retailPrice\":0.0,\"wholesalePrice\":-1.0,\"stockQuantity\":-10,\"description\":\"desc invalid\", \"product_type_id\":1}"))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // HTTP 204 No Content
    @Test
    void testDelete() throws Exception {
        doNothing().when(productService).deleteById(1L);

        mockMvc.perform(delete("/products/1"))
                .andDo(print())
                .andExpect(status().isNoContent());
    }

    // HTTP 404 Not Found
    @Test
    void delete_NotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Product not found")).when(productService).deleteById(99L);

        mockMvc.perform(delete("/products/99"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}
