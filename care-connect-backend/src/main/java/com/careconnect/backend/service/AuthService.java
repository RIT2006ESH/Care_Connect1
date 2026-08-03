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

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .specialty(req.getRole() == Role.DOCTOR ? req.getSpecialty() : null)
                .about(req.getRole() == Role.DOCTOR ? req.getAbout() : null)
                .experienceYears(req.getRole() == Role.DOCTOR ? req.getExperienceYears() : null)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
