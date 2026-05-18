package com.example.back.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ModuleRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    public ModuleRequest() {}

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
