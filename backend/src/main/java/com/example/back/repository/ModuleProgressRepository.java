package com.example.back.repository;

import com.example.back.entity.ModuleProgress;
import com.example.back.entity.Enrollment;
import com.example.back.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleProgressRepository extends JpaRepository<ModuleProgress, Long> {
    Optional<ModuleProgress> findByEnrollmentAndModule(Enrollment enrollment, Module module);
    List<ModuleProgress> findByEnrollment(Enrollment enrollment);
}
