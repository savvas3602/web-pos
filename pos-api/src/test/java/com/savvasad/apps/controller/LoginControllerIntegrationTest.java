package com.savvasad.apps.controller;

import com.savvasad.apps.dto.LoginRequestDto;
import com.savvasad.apps.dto.LoginResponseDto;
import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.service.UsersService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LoginControllerIntegrationTest {
    @Autowired
    UsersService usersService;

    @Autowired
    private RestTestClient restTestClient;

    @BeforeAll
    void setup() {
        usersService.findByUsername("test-user")
                .ifPresent(user -> usersService.deleteById(user.getId()));
    }

    @Test
    void testLogin() {
        UserSaveDto userSaveDto = new UserSaveDto(
                null,
                "test-user",
                "Test User",
                "test-user@email.com",
                "password123"

        );
        usersService.save(userSaveDto);

        AtomicReference<String> jwtToken = new AtomicReference<>();
        restTestClient.post().uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .body(new LoginRequestDto(userSaveDto.username(), "password123"))
                .exchange()
                .expectStatus().isOk()
                .expectBody(LoginResponseDto.class)
                .value(loginResponse -> {
                    assertThat(loginResponse).isNotNull();
                    assertThat(loginResponse.username()).isEqualTo("test-user");
                    assertThat(loginResponse.token()).isNotBlank();

                    jwtToken.set(loginResponse.token());
                });

        restTestClient.get().uri("/products")
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", bearer(jwtToken.get()))
                .exchange()
                .expectStatus().isOk();
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}