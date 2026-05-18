package com.example.back.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class CourseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @PositiveOrZero(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Level is required")
    private String level;

    public CourseRequest() {}

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

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}