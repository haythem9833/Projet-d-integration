package com.example.back.dto.response;

public class EnrollmentResponse {

    private Long id;
    private Long userId;
    private Long courseId;
    private String enrolledAt;
    private String completedAt;
    private Double progress;
    private String courseTitle;
    private String courseDescription;
    private String courseCategory;
    private String courseLevel;

    public EnrollmentResponse(Long id, Long userId, Long courseId, String enrolledAt, String completedAt, Double progress) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.enrolledAt = enrolledAt;
        this.completedAt = completedAt;
        this.progress = progress;
    }

    public EnrollmentResponse(Long id, Long userId, Long courseId, String enrolledAt, String completedAt, Double progress,
                             String courseTitle, String courseDescription, String courseCategory, String courseLevel) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.enrolledAt = enrolledAt;
        this.completedAt = completedAt;
        this.progress = progress;
        this.courseTitle = courseTitle;
        this.courseDescription = courseDescription;
        this.courseCategory = courseCategory;
        this.courseLevel = courseLevel;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getEnrolledAt() {
        return enrolledAt;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public Double getProgress() {
        return progress;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public String getCourseCategory() {
        return courseCategory;
    }

    public String getCourseLevel() {
        return courseLevel;
    }
}
