package com.example.back.repository;

import com.example.back.entity.Course;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTrainer(User trainer);

    List<Course> findByTitleContainingIgnoreCase(String title);

    // Filtrage par catégorie
    List<Course> findByCategory(String category);

    // Filtrage par niveau
    List<Course> findByLevel(String level);

    // Filtrage par catégorie et niveau
    List<Course> findByCategoryAndLevel(String category, String level);

    // Recherche avec plage de prix
    List<Course> findByPriceBetween(Double minPrice, Double maxPrice);

    // Recherche combinée: titre + catégorie
    List<Course> findByTitleContainingIgnoreCaseAndCategory(String title, String category);

    // Recherche combinée: titre + niveau
    List<Course> findByTitleContainingIgnoreCaseAndLevel(String title, String level);

    // Tous les filtres
    @Query("SELECT c FROM Course c WHERE " +
            "(:title IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:category IS NULL OR c.category = :category) AND " +
            "(:level IS NULL OR c.level = :level) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice)")
    List<Course> searchCourses(
            @Param("title") String title,
            @Param("category") String category,
            @Param("level") String level,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

    // Compter les cours par catégorie
    long countByCategory(String category);

    // Compter les cours par niveau
    long countByLevel(String level);
}