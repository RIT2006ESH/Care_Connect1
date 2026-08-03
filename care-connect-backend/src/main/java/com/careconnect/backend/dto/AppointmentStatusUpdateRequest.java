package com.careconnect.backend.dto;

import com.careconnect.backend.model.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentStatusUpdateRequest {
    @NotNull
    private AppointmentStatus status;
}
