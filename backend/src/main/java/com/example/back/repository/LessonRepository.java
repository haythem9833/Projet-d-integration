package com.example.back.repository;

import com.example.back.entity.Lesson;
import com.example.back.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByModule(Module module);

    List<Lesson> findByModuleId(Long moduleId);
}