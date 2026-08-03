package com.careconnect.backend.controller;

import com.careconnect.backend.dto.DoctorStatsResponse;
import com.careconnect.backend.dto.DoctorSummary;
import com.careconnect.backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    // Admin: list every doctor on the portal
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DoctorSummary>> listDoctors() {
        return ResponseEntity.ok(doctorService.listAllDoctors());
    }

    // Admin: aggregated stats for one doctor (drill-down after clicking a name)
    @GetMapping("/{doctorId}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorStatsResponse> stats(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.statsFor(doctorId));
    }
}
