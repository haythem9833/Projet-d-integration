package com.example.back.repository;

import com.example.back.entity.Certificate;
import com.example.back.entity.User;
import com.example.back.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUser(User user);

    List<Certificate> findByCourse(Course course);

    Optional<Certificate> findByUserAndCourse(User user, Course course);

    List<Certificate> findByStatus(String status);

    @Query("SELECT c FROM Certificate c WHERE c.user = :user AND c.status = 'ACTIVE'")
    List<Certificate> findActiveCertificatesByUser(@Param("user") User user);

    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.user = :user AND c.status = 'ACTIVE'")
    long countActiveCertificatesByUser(@Param("user") User user);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);
}
