package com.example.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.back.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
}