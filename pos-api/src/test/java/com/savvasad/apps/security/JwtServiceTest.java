package com.savvasad.apps.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

class JwtServiceTest {
    private static final Logger log = LoggerFactory.getLogger(JwtServiceTest.class);

    private JwtService jwtService;

    private final String username = "username";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "YourSecretKeyForJWTGenerationWhichShouldBeLongEnough");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 86400000L); // 1 day
    }

    @Test
    void generateToken() throws JsonProcessingException {
        String jwtToken = jwtService.generateToken(username);
        log.info("JWT Token: {}", jwtToken);

        String[] parts = jwtToken.split("\\.");
        log.info("Header: {}, Payload: {}, Signature: {}", parts[0], parts[1], parts[2]);

        // Assert correct formatting
        assertThat(
                parts.length == 3
                        && !parts[0].isEmpty()
                        && !parts[1].isEmpty()
                        && !parts[2].isEmpty()
        ).isTrue();

        JsonNode node = decodeJwtTokenPart(parts[1]);
        log.info("Decoded Payload: {}", node);

        // Assert the correct expiry date
        assertThat(
                node.findValue("exp").toString()
                        .equals(String.valueOf(System.currentTimeMillis() + jwtService.jwtExpirationMs))
        );

        // Assert correct username is set
        assertThat(node.findValue("sub").toString().equals("\"" + username + "\""));

        // Assert issued at is set
        assertThat(node.findValue("iat").toString().equals(String.valueOf(System.currentTimeMillis())));
    }

    @Test
    void isTokenValid_returnsTrueForValidToken() {
        String token = jwtService.generateToken(username);
        assertThat(jwtService.isTokenValid(token, username)).isTrue();
    }

    @Test
    void isTokenValid_returnsFalseForInvalidUsername() {
        String token = jwtService.generateToken(username);
        assertThat(jwtService.isTokenValid(token, "other_user")).isFalse();
    }

    @Test
    void isTokenValid_returnsFalseForExpiredToken() {
        long originalExpiration = jwtService.jwtExpirationMs;
        jwtService.jwtExpirationMs = -1000;

        String token = jwtService.generateToken(username);

        assertThatThrownBy(() -> jwtService.isTokenValid(token, username))
                .isInstanceOf(ExpiredJwtException.class);

        // Restore original expiration time
        jwtService.jwtExpirationMs = originalExpiration;
    }

    private JsonNode decodeJwtTokenPart(String tokenPart) throws JsonProcessingException {
        String decodedTokenPartJson = new String(Base64.getUrlDecoder().decode(tokenPart));
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(decodedTokenPartJson);
    }
}