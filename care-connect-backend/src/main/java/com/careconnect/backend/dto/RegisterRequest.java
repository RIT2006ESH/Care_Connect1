package com.careconnect.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    private String phone;

    @NotBlank
    private String role; // "user" | "doctor" | "admin" (case-insensitive)

    // Optional, only meaningful when role == doctor
    private String specialty;
    private String about;
    private Integer experienceYears;
}
