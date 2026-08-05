package com.careconnect.backend.service;

import com.careconnect.backend.dto.AuthResponse;
import com.careconnect.backend.dto.LoginRequest;
import com.careconnect.backend.dto.RegisterRequest;
import com.careconnect.backend.exception.BadRequestException;
import com.careconnect.backend.model.Role;
import com.careconnect.backend.model.User;
import com.careconnect.backend.repository.UserRepository;
import com.careconnect.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private Role parseRole(String raw) {
        try {
            return Role.valueOf(raw.trim().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid role: " + raw + " (expected user, doctor, or admin)");
        }
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        Role role = parseRole(req.getRole());

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(role)
                .specialty(role == Role.DOCTOR ? req.getSpecialty() : null)
                .about(role == Role.DOCTOR ? req.getAbout() : null)
                .experienceYears(role == Role.DOCTOR ? req.getExperienceYears() : null)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return toResponse(user, token);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email, password, or role"));

        // If the frontend sent a role (e.g. logging in via the "doctor" portal),
        // reject if it doesn't match the account's actual role — mirrors the
        // old findUserByCredentials(email, password, role) behavior.
        if (req.getRole() != null && !req.getRole().isBlank()) {
            Role requestedRole = parseRole(req.getRole());
            if (user.getRole() != requestedRole) {
                throw new BadRequestException("Invalid email, password, or role");
            }
        }

        String token = jwtUtil.generateToken(user);
        return toResponse(user, token);
    }

    private AuthResponse toResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name().toLowerCase())
                .build();
    }
}
