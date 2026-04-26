package com.example.back.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.entity.Lesson;
import com.example.back.repository.LessonRepository;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public Lesson save(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getByModule(Long moduleId) {
        return lessonRepository.findByModuleId(moduleId);
    }
}