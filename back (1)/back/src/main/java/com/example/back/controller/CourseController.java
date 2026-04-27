package com.example.back.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

        // ========================
        // CRUD OPERATIONS
        // ========================

        @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
        @PostMapping
        public ResponseEntity<CourseResponse> create(
                        @Valid @RequestBody CourseRequest request) {
                Course course = new Course();
                course.setTitle(request.getTitle());
                course.setDescription(request.getDescription());
                course.setPrice(request.getPrice());
                course.setCategory(request.getCategory());
                course.setLevel(request.getLevel());

                Course saved = courseService.create(course);

                return ResponseEntity.status(HttpStatus.CREATED).body(
                                new CourseResponse(
                                                saved.getId(),
                                                saved.getTitle(),
                                                saved.getDescription(),
                                                saved.getPrice(),
                                                saved.getCategory(),
                                                saved.getLevel()));
        }

        // Voir tous les cours
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
                                                c.getLevel()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // Voir détails d'un cours
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
                                                c.getLevel()));
        }

        // Mettre à jour un cours
        @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
        @PutMapping("/{id}")
        public ResponseEntity<CourseResponse> updateCourse(
                        @PathVariable Long id,
                        @Valid @RequestBody CourseRequest request) {
                Course courseDetails = new Course();
                courseDetails.setTitle(request.getTitle());
                courseDetails.setDescription(request.getDescription());
                courseDetails.setPrice(request.getPrice());
                courseDetails.setCategory(request.getCategory());
                courseDetails.setLevel(request.getLevel());

                Course updated = courseService.update(id, courseDetails);

                return ResponseEntity.ok(
                                new CourseResponse(
                                                updated.getId(),
                                                updated.getTitle(),
                                                updated.getDescription(),
                                                updated.getPrice(),
                                                updated.getCategory(),
                                                updated.getLevel()));
        }

        // Supprimer un cours
        @PreAuthorize("hasRole('ADMIN')")
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
                courseService.delete(id);
                return ResponseEntity.ok("Course deleted successfully");
        }

        // ========================
        // SEARCH & FILTERING
        // ========================

        // Rechercher par titre
        @GetMapping("/search/title")
        public ResponseEntity<List<CourseResponse>> searchByTitle(
                        @RequestParam String title) {
                List<CourseResponse> list = courseService.searchByTitle(title)
                                .stream()
                                .map(c -> new CourseResponse(
                                                c.getId(),
                                                c.getTitle(),
                                                c.getDescription(),
                                                c.getPrice(),
                                                c.getCategory(),
                                                c.getLevel()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // Filtrer par catégorie
        @GetMapping("/filter/category")
        public ResponseEntity<List<CourseResponse>> filterByCategory(
                        @RequestParam String category) {
                List<CourseResponse> list = courseService.filterByCategory(category)
                                .stream()
                                .map(c -> new CourseResponse(
                                                c.getId(),
                                                c.getTitle(),
                                                c.getDescription(),
                                                c.getPrice(),
                                                c.getCategory(),
                                                c.getLevel()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // Filtrer par niveau
        @GetMapping("/filter/level")
        public ResponseEntity<List<CourseResponse>> filterByLevel(
                        @RequestParam String level) {
                List<CourseResponse> list = courseService.filterByLevel(level)
                                .stream()
                                .map(c -> new CourseResponse(
                                                c.getId(),
                                                c.getTitle(),
                                                c.getDescription(),
                                                c.getPrice(),
                                                c.getCategory(),
                                                c.getLevel()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // Filtrer par plage de prix
        @GetMapping("/filter/price")
        public ResponseEntity<List<CourseResponse>> filterByPrice(
                        @RequestParam Double minPrice,
                        @RequestParam Double maxPrice) {
                List<CourseResponse> list = courseService.filterByPriceRange(minPrice, maxPrice)
                                .stream()
                                .map(c -> new CourseResponse(
                                                c.getId(),
                                                c.getTitle(),
                                                c.getDescription(),
                                                c.getPrice(),
                                                c.getCategory(),
                                                c.getLevel()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // Recherche avancée: tous les critères
        @GetMapping("/search/advanced")
        public ResponseEntity<List<CourseResponse>> advancedSearch(
                        @RequestParam(required = false) String title,
                        @RequestParam(required = false) String category,
                        @RequestParam(required = false) String level,
                        @RequestParam(required = false) Double minPrice,
                        @RequestParam(required = false) Double maxPrice) {
                List<CourseResponse> list = courseService.advancedSearch(title, category, level, minPrice, maxPrice)
                                .stream()
                                .map(c -> new CourseResponse(
                                                c.getId(),
                                                c.getTitle(),
                                                c.getDescription(),
                                                c.getPrice(),
                                                c.getCategory(),
                                                c.getLevel()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // ========================
        // METADATA (Pour le UI)
        // ========================

        // Obtenir toutes les catégories disponibles
        @GetMapping("/metadata/categories")
        public ResponseEntity<List<String>> getCategories() {
                return ResponseEntity.ok(courseService.getAllCategories());
        }

        // Obtenir tous les niveaux disponibles
        @GetMapping("/metadata/levels")
        public ResponseEntity<List<String>> getLevels() {
                return ResponseEntity.ok(courseService.getAllLevels());
        }
}