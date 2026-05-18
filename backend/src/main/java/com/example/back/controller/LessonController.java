package com.example.back.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.dto.request.LessonRequest;
import com.example.back.dto.response.LessonResponse;
import com.example.back.entity.Lesson;
import com.example.back.entity.Module;
import com.example.back.service.LessonService;
import com.example.back.service.ModuleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;
    private final ModuleService moduleService;

    public LessonController(LessonService lessonService, ModuleService moduleService) {
        this.lessonService = lessonService;
        this.moduleService = moduleService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody LessonRequest request) {
        try {
            // Get the module
            Module module = moduleService.getModuleById(request.getModuleId());
            
            // Create lesson
            Lesson lesson = new Lesson();
            lesson.setTitle(request.getTitle());
            lesson.setContent(request.getContent());
            lesson.setVideoUrl(request.getVideoUrl());
            lesson.setModule(module);
            
            // Save lesson
            Lesson saved = lessonService.save(lesson);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new LessonResponse(saved.getId(), saved.getTitle(), saved.getContent(), saved.getVideoUrl(), saved.getModule().getId())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating lesson: " + e.getMessage());
        }
    }

    @GetMapping("/module/{id}")
    public ResponseEntity<?> getByModule(@PathVariable Long id) {
        return ResponseEntity.ok(
            lessonService.getByModule(id)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Lesson lesson = lessonService.getById(id);
            return ResponseEntity.ok(
                new LessonResponse(lesson.getId(), lesson.getTitle(), lesson.getContent(), lesson.getVideoUrl(), lesson.getModule().getId())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found: " + e.getMessage());
        }
    }
}
