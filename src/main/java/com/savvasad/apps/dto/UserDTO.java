package com.savvasad.apps.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public record UserDTO(
    Long id,

    @NotBlank(message = "Username is mandatory")
    String username,

    @NotBlank(message = "Full name is mandatory")
    String fullName,

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    String email,

    LocalDateTime createdAt,

    LocalDateTime updatedAt,

    String token
) {}
