package com.teamup.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamup.dto.LoginRequestDTO;
import com.teamup.dto.LoginResponseDTO;
import com.teamup.dto.RegisterRequestDTO;
import com.teamup.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private AuthService authServ;

    public AuthController(AuthService authServ) {
        this.authServ = authServ;
    }

    // 1. Register User
    @PostMapping("/register")
    public String registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        return authServ.registerUser(request);
    }

    // 2. Login User
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(
            @Valid @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(authServ.loginUser(request));
    }

}
