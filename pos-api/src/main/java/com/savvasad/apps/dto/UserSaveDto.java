package com.savvasad.apps.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserSaveDto(
    @NotBlank(message = "Username is mandatory")
    String username,

    @NotBlank(message = "Full name is mandatory")
    String fullName,

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    String email,

    @NotBlank(message = "Password is mandatory")
    String password
) {}
