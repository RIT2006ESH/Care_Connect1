package com.careconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

// Sent by the patient when booking. patientId comes from the authenticated
// JWT on the backend, NOT from this body, so it can't be spoofed.
@Data
public class AppointmentRequest {
    @NotNull
    private Long doctorId;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @NotBlank
    private String mode; // "Video Call" | "In-Person"

    private String reason;
}
