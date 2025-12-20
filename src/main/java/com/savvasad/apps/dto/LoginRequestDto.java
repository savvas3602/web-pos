package com.savvasad.apps.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LoginRequestDto(
        @NotNull
        @Size(min = 4)
        String username,

        @NotNull
        @Size(min = 4)
        String password
) {}
