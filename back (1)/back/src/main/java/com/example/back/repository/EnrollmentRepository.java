package com.example.back.repository;

import com.example.back.entity.Enrollment;
import com.example.back.entity.User;
import com.example.back.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudent(User student);

    List<Enrollment> findByStudentId(Long studentId);

    List<Enrollment> findByCourse(Course course);

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    boolean existsByStudentAndCourse(User student, Course course);
}