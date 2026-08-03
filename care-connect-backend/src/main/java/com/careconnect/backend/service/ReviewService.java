package com.careconnect.backend.service;

import com.careconnect.backend.dto.ReviewRequest;
import com.careconnect.backend.dto.ReviewResponse;
import com.careconnect.backend.exception.BadRequestException;
import com.careconnect.backend.exception.ResourceNotFoundException;
import com.careconnect.backend.model.*;
import com.careconnect.backend.repository.AppointmentRepository;
import com.careconnect.backend.repository.ReviewRepository;
import com.careconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public ReviewResponse leaveReview(User patient, ReviewRequest req) {
        User doctor = userRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new BadRequestException("Selected user is not a doctor");
        }

        Appointment appointment = null;
        if (req.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(req.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

            if (!appointment.getPatient().getId().equals(patient.getId())) {
                throw new BadRequestException("This appointment doesn't belong to you");
            }
            if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
                throw new BadRequestException("You can only review a completed appointment");
            }
        }

        Review review = Review.builder()
                .doctor(doctor)
                .patient(patient)
                .appointment(appointment)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        recalculateDoctorRating(doctor.getId());
        return ReviewResponse.from(saved);
    }

    public List<ReviewResponse> forDoctor(Long doctorId) {
        return reviewRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId)
                .stream().map(ReviewResponse::from).toList();
    }

    private void recalculateDoctorRating(Long doctorId) {
        Double avg = reviewRepository.findAverageRatingByDoctorId(doctorId);
        userRepository.findById(doctorId).ifPresent(doc -> {
            doc.setRating(avg);
            userRepository.save(doc);
        });
    }
}
