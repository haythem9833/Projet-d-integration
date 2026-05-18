package com.example.back.controller;

import com.example.back.dto.request.LoginRequest;
import com.example.back.dto.response.AuthResponse;
import com.example.back.entity.User;
import com.example.back.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // LOGIN JWT
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        String token = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        // Get user data
        User user = authService.getUserByEmail(request.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(token, "Login successful", user)
        );
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successful");
    }
}