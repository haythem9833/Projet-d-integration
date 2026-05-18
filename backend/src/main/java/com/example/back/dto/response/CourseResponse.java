package com.example.back.dto.response;

import java.util.List;

public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String level;
    private UserResponse trainer;
    private List<ModuleResponse> modules;
    private List<EnrollmentResponse> enrollments;

    public CourseResponse(Long id, String title, String description,
                          Double price, String category, String level) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.level = level;
    }

    public CourseResponse(Long id, String title, String description,
                          Double price, String category, String level,
                          UserResponse trainer, List<ModuleResponse> modules,
                          List<EnrollmentResponse> enrollments) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.level = level;
        this.trainer = trainer;
        this.modules = modules;
        this.enrollments = enrollments;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public String getLevel() {
        return level;
    }

    public UserResponse getTrainer() {
        return trainer;
    }

    public List<ModuleResponse> getModules() {
        return modules;
    }

    public List<EnrollmentResponse> getEnrollments() {
        return enrollments;
    }

    public void setTrainer(UserResponse trainer) {
        this.trainer = trainer;
    }

    public void setModules(List<ModuleResponse> modules) {
        this.modules = modules;
    }

    public void setEnrollments(List<EnrollmentResponse> enrollments) {
        this.enrollments = enrollments;
    }
}