package com.savvasad.apps.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;

import java.util.Collections;

/**
 * Controller to validate if the user session is still active.
 * No validation is needed in this class as the token is already validated by the JwtAuthenticationFilter.
 */
@RestController
@RequestMapping("/auth/validate-session")
public class ValidateSessionController {

    @GetMapping
    public ResponseEntity<Object> validateSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);

        return ResponseEntity.ok(Collections.singletonMap("isAuthenticated", isAuthenticated));
    }
}
