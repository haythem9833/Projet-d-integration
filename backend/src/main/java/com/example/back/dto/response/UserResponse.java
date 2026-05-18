package com.example.back.dto.response;

public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public UserResponse(Long id, String firstName, String lastName, String email, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    public UserResponse(Long id, String firstName, String lastName, String email, String role, String createdAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}