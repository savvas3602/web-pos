package com.savvasad.apps.dto;

import jakarta.validation.constraints.NotNull;

public record LoginResponseDto(
        @NotNull
        String message,

        @NotNull
        String username,

        @NotNull
        String token
) {}
