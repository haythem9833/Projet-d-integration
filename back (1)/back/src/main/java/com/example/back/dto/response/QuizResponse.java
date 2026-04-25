package com.example.back.dto.response;

public class QuizResponse {

    private Long id;
    private String title;
    private Long courseId;

    public QuizResponse() {
    }

    public QuizResponse(Long id, String title, Long courseId) {
        this.id = id;
        this.title = title;
        this.courseId = courseId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}