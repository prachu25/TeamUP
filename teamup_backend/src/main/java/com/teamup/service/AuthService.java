package com.teamup.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.teamup.dto.LoginRequestDTO;
import com.teamup.dto.LoginResponseDTO;
import com.teamup.dto.RegisterRequestDTO;
import com.teamup.entity.User;
import com.teamup.exception.DuplicateEmailException;
import com.teamup.exception.InvalidCredentialsException;
import com.teamup.repository.UserRepository;

@Service
public class AuthService {

    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    // 1. Register User
    public String registerUser(RegisterRequestDTO request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException("Email already registerd!");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setTimezone(request.getTimezone());

        userRepo.save(user);

        return "User Registered Successfully!";
    }

    // 2. Login
    public LoginResponseDTO loginUser(LoginRequestDTO request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            User user = userRepo.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return new LoginResponseDTO(
                    user.getUserId(),
                    "Login Successful!");

        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Invalid Email or Password!");
        }
    }

}
