package com.example.back.repository;

import com.example.back.entity.Certificate;
import com.example.back.entity.User;
import com.example.back.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUser(User user);

    List<Certificate> findByUserId(Long userId);

    Optional<Certificate> findByUserAndCourse(User user, Course course);
}