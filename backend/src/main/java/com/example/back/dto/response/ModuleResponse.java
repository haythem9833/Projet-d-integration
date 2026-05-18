package com.example.back.dto.response;

import java.util.List;

public class ModuleResponse {

    private Long id;
    private String title;
    private String description;
    private Long courseId;
    private List<LessonResponse> lessons;

    public ModuleResponse(Long id, String title, String description, Long courseId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseId = courseId;
    }

    public ModuleResponse(Long id, String title, String description, Long courseId, List<LessonResponse> lessons) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseId = courseId;
        this.lessons = lessons;
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

    public Long getCourseId() {
        return courseId;
    }

    public List<LessonResponse> getLessons() {
        return lessons;
    }

    public void setLessons(List<LessonResponse> lessons) {
        this.lessons = lessons;
    }
}
