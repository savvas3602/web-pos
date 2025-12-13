package com.savvasad.apps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BrandDTO(
    Long id,

    @NotBlank
    @Size(max = 255)
    String name,

    String description
) {}
