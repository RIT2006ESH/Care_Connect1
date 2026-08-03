package com.careconnect.backend.dto;

import com.careconnect.backend.model.Appointment;
import com.careconnect.backend.model.AppointmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String specialty;
    private LocalDate date;
    private LocalTime time;
    private String mode;
    private AppointmentStatus status;
    private String reason;

    public static AppointmentResponse from(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getName())
                .specialty(a.getDoctor().getSpecialty())
                .date(a.getDate())
                .time(a.getTime())
                .mode(a.getMode())
                .status(a.getStatus())
                .reason(a.getReason())
                .build();
    }
}
