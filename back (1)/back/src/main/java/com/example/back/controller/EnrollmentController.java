package com.example.back.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.service.EnrollmentService;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<?> getStudentCourses(@PathVariable Long id) {
        return ResponseEntity.ok(
                enrollmentService.getStudentEnrollments(id));
    }

    @PutMapping("/{id}/progress/{value}")
    public ResponseEntity<?> updateProgress(
            @PathVariable Long id,
            @PathVariable Double value) {
        return ResponseEntity.ok(
                enrollmentService.updateProgress(id, value));
    }
}