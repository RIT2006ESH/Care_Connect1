package com.careconnect.backend.dto;

import com.careconnect.backend.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorSummary {
    private Long id;
    private String name;
    private String email;
    private String specialty;
    private Double rating;
    private Integer experienceYears;

    public static DoctorSummary from(User u) {
        return DoctorSummary.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .specialty(u.getSpecialty())
                .rating(u.getRating())
                .experienceYears(u.getExperienceYears())
                .build();
    }
}
