package com.example.back.dto.response;

import com.example.back.entity.User;

public class AuthResponse {

    private String token;
    private String message;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public AuthResponse(String token, String message, User user) {
        this.token = token;
        this.message = message;
        if (user != null) {
            this.user = new UserDto(user);
        }
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    // Inner class for user data
    public static class UserDto {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;

        public UserDto() {}

        public UserDto(User user) {
            this.id = user.getId();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.email = user.getEmail();
            this.role = user.getRole() != null ? user.getRole().toString() : null;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}