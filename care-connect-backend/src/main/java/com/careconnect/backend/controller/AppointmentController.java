package com.careconnect.backend.controller;

import com.careconnect.backend.dto.AppointmentRequest;
import com.careconnect.backend.dto.AppointmentResponse;
import com.careconnect.backend.dto.AppointmentStatusUpdateRequest;
import com.careconnect.backend.model.User;
import com.careconnect.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Patient books an appointment. Patient identity comes from the JWT
    // (@AuthenticationPrincipal), never from the request body.
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<AppointmentResponse> book(@AuthenticationPrincipal User patient,
                                                      @Valid @RequestBody AppointmentRequest req) {
        return ResponseEntity.ok(appointmentService.book(patient, req));
    }

    // Doctor: today's appointments
    @GetMapping("/doctor/{doctorId}/today")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> todayForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.todaysAppointmentsForDoctor(doctorId));
    }

    // Doctor: full appointment history
    @GetMapping("/doctor/{doctorId}/history")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> historyForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.historyForDoctor(doctorId));
    }

    // Patient: today's + history combined (frontend splits by date vs today)
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> allForPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.allForPatient(patientId));
    }

    // Doctor marks complete / cancels; admin can also update
    @PatchMapping("/{appointmentId}/status")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long appointmentId,
                                                              @AuthenticationPrincipal User requester,
                                                              @Valid @RequestBody AppointmentStatusUpdateRequest req) {
        return ResponseEntity.ok(appointmentService.updateStatus(appointmentId, requester, req));
    }
}
