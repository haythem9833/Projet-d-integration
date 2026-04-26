package com.example.back.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.entity.Enrollment;
import com.example.back.repository.EnrollmentRepository;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
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
}