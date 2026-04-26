package com.example.back.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.Lesson;
import com.example.back.service.LessonService;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Lesson lesson) {
        return ResponseEntity.ok(lessonService.save(lesson));
    }

    @GetMapping("/module/{id}")
    public ResponseEntity<?> getByModule(@PathVariable Long id) {
        return ResponseEntity.ok(
            lessonService.getByModule(id)
        );
    }
}