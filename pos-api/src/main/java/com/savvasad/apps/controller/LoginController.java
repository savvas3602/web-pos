package com.savvasad.apps.controller;

import com.savvasad.apps.dto.LoginRequestDto;
import com.savvasad.apps.dto.LoginResponseDto;
import com.savvasad.apps.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/login")
public class LoginController {
    @Value("${app.security.https-enabled}")
    private boolean httpsEnabled;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    public LoginController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            String token = jwtService.generateToken(auth.getName());
            ResponseCookie cookie = ResponseCookie.from("jwt_token", token)
                    .httpOnly(true)
                    .secure(httpsEnabled)
                    .path("/")
                    .maxAge(jwtService.getJwtExpirationMs() / 1000) // Match JWT expiration
                    .sameSite("Strict")
                    .build();

            LoginResponseDto responseDto = new LoginResponseDto(
                    "Authentication Successful",
                    auth.getName(),
                    token
            );

            return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .body(responseDto);

        } catch (BadCredentialsException _) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDto("Invalid username or password", "", ""));
        }
    }
}
