package com.example.back.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.dto.request.ModuleRequest;
import com.example.back.dto.response.ModuleResponse;
import com.example.back.dto.response.LessonResponse;
import com.example.back.entity.Module;
import com.example.back.entity.Course;
import com.example.back.service.ModuleService;
import com.example.back.service.CourseService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final ModuleService moduleService;
    private final CourseService courseService;

    public ModuleController(ModuleService moduleService, CourseService courseService) {
        this.moduleService = moduleService;
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ModuleRequest request) {
        try {
            // Get the course
            Course course = courseService.getById(request.getCourseId());
            
            // Create module
            Module module = new Module();
            module.setTitle(request.getTitle());
            module.setDescription(request.getDescription());
            module.setCourse(course);
            
            // Save module
            Module saved = moduleService.save(module);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ModuleResponse(saved.getId(), saved.getTitle(), saved.getDescription(), saved.getCourse().getId())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating module: " + e.getMessage());
        }
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<?> getByCourse(@PathVariable Long id) {
        try {
            List<Module> modules = moduleService.getByCourse(id);
            List<ModuleResponse> responses = modules.stream()
                .map(m -> new ModuleResponse(
                    m.getId(), 
                    m.getTitle(), 
                    m.getDescription(), 
                    m.getCourse() != null ? m.getCourse().getId() : null,
                    m.getLessons() != null ? m.getLessons().stream()
                        .map(l -> new com.example.back.dto.response.LessonResponse(
                            l.getId(),
                            l.getTitle(),
                            l.getContent(),
                            l.getVideoUrl(),
                            l.getModule() != null ? l.getModule().getId() : null
                        ))
                        .collect(java.util.stream.Collectors.toList())
                    : java.util.Collections.emptyList()
                ))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error fetching modules: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Module module = moduleService.getModuleById(id);
            return ResponseEntity.ok(
                new ModuleResponse(module.getId(), module.getTitle(), module.getDescription(), module.getCourse().getId())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Module not found: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            moduleService.delete(id);
            return ResponseEntity.ok().body("Module deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting module: " + e.getMessage());
        }
    }
}
