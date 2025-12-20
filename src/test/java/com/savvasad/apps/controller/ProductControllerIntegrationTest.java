package com.savvasad.apps.controller;

import com.savvasad.apps.dto.LoginResponseDto;
import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.mapper.ProductMapper;
import com.savvasad.apps.repository.ProductRepository;
import com.savvasad.apps.service.UsersService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureRestTestClient
class ProductControllerIntegrationTest {

    @Autowired
    private RestTestClient restTestClient;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private ProductMapper productMapper;

    AtomicReference<String> jwtToken = new AtomicReference<>("");

    private static final Supplier<ProductDTO> TEST_PRODUCT = () -> new ProductDTO(
            null,
            "Integration Test",
            new BigDecimal("99.99"),
            new BigDecimal("79.99"),
            50,
            "Integration Test Product",
            null
    );

    @BeforeAll
    void setupUserAndToken() {
        usersService.findByUsername("test-user")
                .ifPresent(userEntity -> usersService.deleteById(userEntity.getId()));

        UserSaveDto userSaveDto = new UserSaveDto(
                null,
                "test-user",
                "Test User",
                "test-user@email.com",
                "password1234"
        );
        usersService.save(userSaveDto);

        // Obtain JWT token
        restTestClient.post().uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .body(userSaveDto)
                .exchange()
                .expectStatus().isOk()
                .expectBody(LoginResponseDto.class)
                .value(loginResponse -> {
                    assertThat(loginResponse).isNotNull();
                    assertThat(loginResponse.username()).isEqualTo("test-user");
                    assertThat(loginResponse.token()).isNotBlank();

                    jwtToken.set(loginResponse.token());
                });
    }

    @BeforeEach
    void setup() {
        productRepository.deleteAll(); // Clean state
    }

    @Test
    void testCreateProduct() {
        restTestClient.post().uri("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerToken())
                .body(TEST_PRODUCT.get())
                .exchange()
                .expectStatus().isCreated()
                .expectHeader().exists("Location")
                .expectBody(ProductDTO.class)
                .value(productDTO -> {
                    assertThat(productDTO).isNotNull();
                    assertThat(productDTO.id()).isNotNull();
                    assertThat(productDTO.name()).isEqualTo("Integration Test");
                });
    }

    @Test
    void testGetProduct() {
        ProductEntity saved = productRepository.save(productMapper.toEntity(TEST_PRODUCT.get(), null));
        restTestClient.get().uri("/products/{id}", saved.getId())
                .header("Authorization", getBearerToken())
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductDTO.class)
                .value(productDTO -> {
                    assertThat(productDTO).isNotNull();
                    assertThat(productDTO.id()).isEqualTo(saved.getId());
                    assertThat(productDTO.name()).isEqualTo("Integration Test");
                });
    }

    @Test
    void testDelete() {
        ProductEntity saved = productRepository.save(productMapper.toEntity(TEST_PRODUCT.get(), null));
        restTestClient.delete().uri("/products/{id}", saved.getId())
                .header("Authorization", getBearerToken())
                .exchange()
                .expectStatus().isNoContent();
        assertThat(productRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    void testUpdate() {
        ProductEntity saved = productRepository.save(productMapper.toEntity(TEST_PRODUCT.get(), null));
        ProductDTO updateTo = new ProductDTO(null,
                "Updated Name",
                new BigDecimal("88.88"),
                new BigDecimal("77.77"),
                60,
                "Updated Desc",
                null
        );

        restTestClient.put().uri("/products/{id}", saved.getId())
                .header("Authorization", getBearerToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(updateTo)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductDTO.class)
                .value(productDTO -> {
                    assertThat(productDTO).isNotNull();
                    assertThat(productDTO.name()).isEqualTo("Updated Name");
                    assertThat(productDTO.retailPrice()).isEqualTo(BigDecimal.valueOf(88.88));
                    assertThat(productDTO.description()).isEqualTo("Updated Desc");
                });
    }

    @Test
    void testGetProduct_NotFound() {
        restTestClient.get().uri("/products/{id}", 99999L)
                .header("Authorization", getBearerToken())
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testDelete_NotFound() {
        restTestClient.delete().uri("/products/{id}", 99999L)
                .header("Authorization", getBearerToken())
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testCreateProduct_InvalidInput() {
        ProductDTO invalid = new ProductDTO(null, "", null, null, -1, "", null);
        restTestClient.post().uri("/products")
                .header("Authorization", getBearerToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(invalid)
                .exchange()
                .expectStatus().isBadRequest();
    }

    private String getBearerToken() {
        return "Bearer " + jwtToken;
    }
}