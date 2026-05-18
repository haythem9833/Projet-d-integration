package com.example.back.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.back.dto.response.EnrollmentResponse;
import com.example.back.entity.Enrollment;
import com.example.back.entity.User;
import com.example.back.service.EnrollmentService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // Get student's enrolled courses
    @GetMapping("/my-courses")
    public ResponseEntity<List<EnrollmentResponse>> getMyCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(user.getId());
        
        List<EnrollmentResponse> response = enrollments.stream()
                .map(e -> new EnrollmentResponse(
                        e.getId(),
                        e.getStudent().getId(),
                        e.getCourse().getId(),
                        e.getEnrolledAt().toString(),
                        null,
                        e.getProgress(),
                        e.getCourse().getTitle(),
                        e.getCourse().getDescription(),
                        e.getCourse().getCategory(),
                        e.getCourse().getLevel()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // Enroll in a course
    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        Enrollment enrollment = enrollmentService.enrollStudent(user.getId(), courseId);
        
        EnrollmentResponse response = new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getStudent().getId(),
                enrollment.getCourse().getId(),
                enrollment.getEnrolledAt().toString(),
                null,
                enrollment.getProgress(),
                enrollment.getCourse().getTitle(),
                enrollment.getCourse().getDescription(),
                enrollment.getCourse().getCategory(),
                enrollment.getCourse().getLevel()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Check if student is enrolled in a course
    @GetMapping("/check/{courseId}")
    public ResponseEntity<Boolean> checkEnrollment(
            @PathVariable Long courseId,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        boolean isEnrolled = enrollmentService.isStudentEnrolled(user.getId(), courseId);
        
        return ResponseEntity.ok(isEnrolled);
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