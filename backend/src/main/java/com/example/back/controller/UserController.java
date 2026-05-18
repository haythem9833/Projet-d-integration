package com.example.back.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.back.dto.request.LoginRequest;
import com.example.back.dto.request.RegisterRequest;
import com.example.back.dto.response.AuthResponse;
import com.example.back.dto.response.UserResponse;
import com.example.back.entity.User;
import com.example.back.entity.Role;
import com.example.back.service.UserService;
import com.example.back.service.AuthService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class UserController {

        private final UserService userService;
        private final AuthService authService;

        public UserController(UserService userService, AuthService authService) {
                this.userService = userService;
                this.authService = authService;
        }

        // SIGNUP
        @PostMapping("/signup")
        public ResponseEntity<AuthResponse> signup(
                        @Valid @RequestBody RegisterRequest request) {

                User user = new User();
                user.setFirstName(request.getFirstName());
                user.setLastName(request.getLastName());
                user.setEmail(request.getEmail());
                user.setPassword(request.getPassword());
                
                // Set role from request
                if (request.getRole() != null) {
                        String roleStr = request.getRole().toUpperCase();
                        // Support both PROFESSOR and TRAINER
                        if (roleStr.equals("PROFESSOR")) {
                                user.setRole(Role.PROFESSOR);
                        } else if (roleStr.equals("TRAINER")) {
                                user.setRole(Role.TRAINER);
                        } else if (roleStr.equals("ADMIN")) {
                                user.setRole(Role.ADMIN);
                        } else {
                                user.setRole(Role.STUDENT); // Default
                        }
                } else {
                        user.setRole(Role.STUDENT); // Default role
                }

                User savedUser = userService.signup(user);

                // Generate JWT token for the new user
                String token = authService.login(savedUser.getEmail(), request.getPassword());

                AuthResponse response = new AuthResponse(token, "Signup successful", savedUser);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        // GET USERS
        @PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/users")
        public ResponseEntity<List<UserResponse>> getAllUsers() {

                List<UserResponse> users = userService.getAllUsers()
                                .stream()
                                .map(user -> new UserResponse(
                                                user.getId(),
                                                user.getFirstName(),
                                                user.getLastName(),
                                                user.getEmail(),
                                                user.getRole().toString(),
                                                user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(users);
        }
}