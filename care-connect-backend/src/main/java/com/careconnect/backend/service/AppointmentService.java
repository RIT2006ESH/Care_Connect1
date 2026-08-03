package com.careconnect.backend.service;

import com.careconnect.backend.dto.AppointmentRequest;
import com.careconnect.backend.dto.AppointmentResponse;
import com.careconnect.backend.dto.AppointmentStatusUpdateRequest;
import com.careconnect.backend.exception.BadRequestException;
import com.careconnect.backend.exception.ResourceNotFoundException;
import com.careconnect.backend.model.Appointment;
import com.careconnect.backend.model.AppointmentStatus;
import com.careconnect.backend.model.Role;
import com.careconnect.backend.model.User;
import com.careconnect.backend.repository.AppointmentRepository;
import com.careconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentResponse book(User patient, AppointmentRequest req) {
        User doctor = userRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new BadRequestException("Selected user is not a doctor");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .date(req.getDate())
                .time(req.getTime())
                .mode(req.getMode())
                .reason(req.getReason())
                .status(AppointmentStatus.UPCOMING)
                .build();

        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    // --- Doctor views ---

    public List<AppointmentResponse> todaysAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctor_IdAndDateOrderByTimeAsc(doctorId, LocalDate.now())
                .stream().map(AppointmentResponse::from).toList();
    }

    public List<AppointmentResponse> historyForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctor_IdOrderByDateDescTimeDesc(doctorId)
                .stream().map(AppointmentResponse::from).toList();
    }

    // --- Patient view ---

    public List<AppointmentResponse> allForPatient(Long patientId) {
        return appointmentRepository.findByPatient_IdOrderByDateDescTimeDesc(patientId)
                .stream().map(AppointmentResponse::from).toList();
    }

    // --- Status update (doctor marks complete / cancels) ---

    public AppointmentResponse updateStatus(Long appointmentId, User requester, AppointmentStatusUpdateRequest req) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        boolean isOwningDoctor = appointment.getDoctor().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isOwningDoctor && !isAdmin) {
            throw new BadRequestException("Only the assigned doctor or an admin can update this appointment");
        }

        appointment.setStatus(req.getStatus());
        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }
}
