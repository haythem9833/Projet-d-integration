package com.example.back.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private LocalDate enrolledAt;
    public LocalDate getEnrolledAt() {
        return enrolledAt;
    }
    public void setEnrolledAt(LocalDate enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
    private Double progress = 0.0;
    public Double getProgress() {
        return progress;
    }
    public void setProgress(Double progress) {
        this.progress = progress;
    }

    // getters setters
}