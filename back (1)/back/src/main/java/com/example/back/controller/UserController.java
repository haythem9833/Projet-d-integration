package com.example.back.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.back.dto.request.LoginRequest;
import com.example.back.dto.request.RegisterRequest;
import com.example.back.dto.response.AuthResponse;
import com.example.back.dto.response.UserResponse;
import com.example.back.entity.User;
import com.example.back.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class UserController {

        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        // SIGNUP
        @PostMapping("/signup")
        public ResponseEntity<UserResponse> signup(
                        @Valid @RequestBody RegisterRequest request) {

                User user = new User();
                user.setFirstName(request.getFirstName());
                user.setLastName(request.getLastName());
                user.setEmail(request.getEmail());
                user.setPassword(request.getPassword());

                User savedUser = userService.signup(user);

                UserResponse response = new UserResponse(
                                savedUser.getId(),
                                savedUser.getFirstName(),
                                savedUser.getLastName(),
                                savedUser.getEmail());

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        // LOGIN
        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(
                        @Valid @RequestBody LoginRequest request) {

                String token = userService.login(
                                request.getEmail(),
                                request.getPassword());

                return ResponseEntity.ok(
                                new AuthResponse(token, "Login successful"));
        }

        // GET USERS
        @GetMapping("/users")
        public ResponseEntity<List<UserResponse>> getAllUsers() {

                List<UserResponse> users = userService.getAllUsers()
                                .stream()
                                .map(user -> new UserResponse(
                                                user.getId(),
                                                user.getFirstName(),
                                                user.getLastName(),
                                                user.getEmail()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(users);
        }
}