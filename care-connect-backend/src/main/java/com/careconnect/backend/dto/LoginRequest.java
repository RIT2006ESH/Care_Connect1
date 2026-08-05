package com.careconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    // Optional: if provided, must match the account's actual role
    // (mirrors the old findUserByCredentials(email, password, role) check)
    private String role;
}
