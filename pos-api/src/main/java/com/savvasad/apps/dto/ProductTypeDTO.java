package com.savvasad.apps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for Product Type.
 */
public record ProductTypeDTO(
    Long id,

    @NotBlank(message = "Name is mandatory")
    @Size(max = 100, message = "Name must be at most 100 characters")
    String name,

    @Size(max = 255, message = "Description must be at most 255 characters")
    String description
) {}
