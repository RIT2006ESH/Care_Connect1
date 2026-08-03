package com.careconnect.backend.dto;

import com.careconnect.backend.model.Role;
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

    @NotBlank
    private Role role; // PATIENT | DOCTOR | ADMIN

    // Optional, only meaningful when role == DOCTOR
    private String specialty;
    private String about;
    private Integer experienceYears;
}
