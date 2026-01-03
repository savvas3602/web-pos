package com.savvasad.apps.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record PaymentMethodDTO(
    Long id,
    @NotBlank(message = "Payment method name cannot be blank")
    @Size(max = 255, message = "Payment method name cannot exceed 255 characters")
    String name,
    String description
) {}
