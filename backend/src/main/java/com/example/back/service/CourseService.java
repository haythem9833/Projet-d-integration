package com.example.back.service;

import org.springframework.stereotype.Service;

import com.example.back.entity.Course;
import com.example.back.repository.CourseRepository;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // CREATE
    public Course create(Course course) {
        return courseRepository.save(course);
    }

    // READ - All courses
    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    // READ - By ID
    public Course getById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // UPDATE
    public Course update(Long id, Course courseDetails) {
        Course course = getById(id);
        
        if (courseDetails.getTitle() != null) {
            course.setTitle(courseDetails.getTitle());
        }
        if (courseDetails.getDescription() != null) {
            course.setDescription(courseDetails.getDescription());
        }
        if (courseDetails.getPrice() != null) {
            course.setPrice(courseDetails.getPrice());
        }
        if (courseDetails.getCategory() != null) {
            course.setCategory(courseDetails.getCategory());
        }
        if (courseDetails.getLevel() != null) {
            course.setLevel(courseDetails.getLevel());
        }
        
        return courseRepository.save(course);
    }

    // DELETE
    public void delete(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found");
        }
        courseRepository.deleteById(id);
    }

     

    // Recherche par titre
    public List<Course> searchByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }

    // Filtrage par catégorie
    public List<Course> filterByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    // Filtrage par niveau
    public List<Course> filterByLevel(String level) {
        return courseRepository.findByLevel(level);
    }

    // Filtrage par catégorie et niveau
    public List<Course> filterByCategoryAndLevel(String category, String level) {
        return courseRepository.findByCategoryAndLevel(category, level);
    }

    // Filtrage par plage de prix
    public List<Course> filterByPriceRange(Double minPrice, Double maxPrice) {
        return courseRepository.findByPriceBetween(minPrice, maxPrice);
    }

    // Recherche combinée: titre + catégorie
    public List<Course> searchByTitleAndCategory(String title, String category) {
        return courseRepository.findByTitleContainingIgnoreCaseAndCategory(title, category);
    }

    // Recherche combinée: titre + niveau
    public List<Course> searchByTitleAndLevel(String title, String level) {
        return courseRepository.findByTitleContainingIgnoreCaseAndLevel(title, level);
    }

    // Recherche avancée: tous les critères
    public List<Course> advancedSearch(String title, String category, String level, 
                                       Double minPrice, Double maxPrice) {
        return courseRepository.searchCourses(title, category, level, minPrice, maxPrice);
    }

    // Obtenir toutes les catégories uniques
    public List<String> getAllCategories() {
        return courseRepository.findAll().stream()
                .map(Course::getCategory)
                .distinct()
                .toList();
    }

    // Obtenir tous les niveaux uniques
    public List<String> getAllLevels() {
        return courseRepository.findAll().stream()
                .map(Course::getLevel)
                .distinct()
                .toList();
    }
}