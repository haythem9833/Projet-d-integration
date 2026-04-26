package com.example.back.repository;

import com.example.back.entity.Quiz;
import com.example.back.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findByCourse(Course course);

    Optional<Quiz> findByCourseId(Long courseId);
}