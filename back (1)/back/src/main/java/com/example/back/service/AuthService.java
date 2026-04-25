package com.example.back.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public String login(
            String email,
            String password
    ) {

        if (email.equals("admin@test.com")
                && password.equals("123456")) {
            return "jwt-token-example";
        }

        throw new RuntimeException(
                "Invalid email or password"
        );
    }
}