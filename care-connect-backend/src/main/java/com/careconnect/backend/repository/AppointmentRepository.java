package com.careconnect.backend.repository;

import com.careconnect.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Doctor: today's appointments
    List<Appointment> findByDoctor_IdAndDateOrderByTimeAsc(Long doctorId, LocalDate date);

    // Doctor: full history (all appointments, any date), most recent first
    List<Appointment> findByDoctor_IdOrderByDateDescTimeDesc(Long doctorId);

    // Patient: all their appointments (today + history combined; frontend can split by date)
    List<Appointment> findByPatient_IdOrderByDateDescTimeDesc(Long patientId);

    long countByDoctor_Id(Long doctorId);

    long countByDoctor_IdAndStatus(Long doctorId, com.careconnect.backend.model.AppointmentStatus status);
}
