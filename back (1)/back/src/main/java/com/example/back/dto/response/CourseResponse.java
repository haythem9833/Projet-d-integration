package com.example.back.dto.response;

public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String level;

    public CourseResponse(Long id, String title, String description,
                          Double price, String category, String level) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.level = level;
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
}