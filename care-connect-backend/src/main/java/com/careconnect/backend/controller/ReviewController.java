package com.careconnect.backend.controller;

import com.careconnect.backend.dto.ReviewRequest;
import com.careconnect.backend.dto.ReviewResponse;
import com.careconnect.backend.model.User;
import com.careconnect.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ReviewResponse> leaveReview(@AuthenticationPrincipal User patient,
                                                        @Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(reviewService.leaveReview(patient, req));
    }

    // Used by both the doctor's own profile and the admin drill-down view
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN','PATIENT')")
    public ResponseEntity<List<ReviewResponse>> reviewsForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(reviewService.forDoctor(doctorId));
    }
}
