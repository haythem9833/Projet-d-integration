package com.example.back.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.back.dto.request.CourseRequest;
import com.example.back.dto.response.CourseResponse;
import com.example.back.entity.Course;
import com.example.back.service.CourseService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<CourseResponse> create(
            @Valid @RequestBody CourseRequest request
    ) {

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());

        Course saved = courseService.create(course);

        return ResponseEntity.ok(
                new CourseResponse(
                        saved.getId(),
                        saved.getTitle(),
                        saved.getDescription(),
                        saved.getPrice(),
                        saved.getCategory(),
                        saved.getLevel()
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAll() {

        List<CourseResponse> list = courseService.getAll()
                .stream()
                .map(c -> new CourseResponse(
                        c.getId(),
                        c.getTitle(),
                        c.getDescription(),
                        c.getPrice(),
                        c.getCategory(),
                        c.getLevel()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getById(@PathVariable Long id) {

        Course c = courseService.getById(id);

        return ResponseEntity.ok(
                new CourseResponse(
                        c.getId(),
                        c.getTitle(),
                        c.getDescription(),
                        c.getPrice(),
                        c.getCategory(),
                        c.getLevel()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.ok("Course deleted");
    }
}