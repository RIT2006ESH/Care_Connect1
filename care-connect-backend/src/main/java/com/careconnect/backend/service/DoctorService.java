package com.careconnect.backend.service;

import com.careconnect.backend.dto.DoctorStatsResponse;
import com.careconnect.backend.dto.DoctorSummary;
import com.careconnect.backend.exception.ResourceNotFoundException;
import com.careconnect.backend.model.AppointmentStatus;
import com.careconnect.backend.model.Role;
import com.careconnect.backend.model.User;
import com.careconnect.backend.repository.AppointmentRepository;
import com.careconnect.backend.repository.ReviewRepository;
import com.careconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReviewRepository reviewRepository;

    public List<DoctorSummary> listAllDoctors() {
        return userRepository.findByRole(Role.DOCTOR)
                .stream().map(DoctorSummary::from).toList();
    }

    public DoctorStatsResponse statsFor(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new ResourceNotFoundException("User is not a doctor");
        }

        long total = appointmentRepository.countByDoctor_Id(doctorId);
        long completed = appointmentRepository.countByDoctor_IdAndStatus(doctorId, AppointmentStatus.COMPLETED);
        long cancelled = appointmentRepository.countByDoctor_IdAndStatus(doctorId, AppointmentStatus.CANCELLED);
        long upcoming = appointmentRepository.countByDoctor_IdAndStatus(doctorId, AppointmentStatus.UPCOMING);
        Double avgRating = reviewRepository.findAverageRatingByDoctorId(doctorId);
        long totalReviews = reviewRepository.countByDoctor_Id(doctorId);

        return DoctorStatsResponse.builder()
                .doctorId(doctor.getId())
                .doctorName(doctor.getName())
                .totalAppointments(total)
                .completedAppointments(completed)
                .cancelledAppointments(cancelled)
                .upcomingAppointments(upcoming)
                .averageRating(avgRating)
                .totalReviews(totalReviews)
                .build();
    }
}
