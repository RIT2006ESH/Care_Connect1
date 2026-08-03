package com.careconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorStatsResponse {
    private Long doctorId;
    private String doctorName;
    private long totalAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private long upcomingAppointments;
    private Double averageRating;
    private long totalReviews;
}
