package com.savvasad.apps.dto;

import com.savvasad.apps.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserSaveDto(
    @NotBlank(message = "Username is mandatory")
    String username,

    @NotBlank(message = "Full name is mandatory")
    String fullName,

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    String email,

    @NotBlank(message = "Password is mandatory")
    String password,

    @NotNull(message = "Role is mandatory")
    UserRole role
) {}
