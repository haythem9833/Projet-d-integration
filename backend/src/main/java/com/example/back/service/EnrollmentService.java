package com.example.back.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.entity.Course;
import com.example.back.entity.Enrollment;
import com.example.back.entity.User;
import com.example.back.repository.CourseRepository;
import com.example.back.repository.EnrollmentRepository;
import com.example.back.repository.UserRepository;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                            UserRepository userRepository,
                            CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public List<Enrollment> getStudentEnrollments(Long userId) {
        return enrollmentRepository.findByStudentId(userId);
    }

    public Enrollment save(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateProgress(Long id, Double progress) {
        Enrollment e = enrollmentRepository.findById(id).orElseThrow();
        e.setProgress(progress);
        return enrollmentRepository.save(e);
    }

    // Enroll a student in a course
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        // Check if already enrolled
        if (isStudentEnrolled(studentId, courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDate.now());
        enrollment.setProgress(0.0);

        return enrollmentRepository.save(enrollment);
    }

    // Check if student is enrolled in a course
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .anyMatch(e -> e.getCourse().getId().equals(courseId));
    }
}