package com.example.back.repository;

import com.example.back.entity.VideoProgress;
import com.example.back.entity.User;
import com.example.back.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoProgressRepository extends JpaRepository<VideoProgress, Long> {

    Optional<VideoProgress> findByUserAndLesson(User user, Lesson lesson);

    List<VideoProgress> findByUser(User user);

    List<VideoProgress> findByLesson(Lesson lesson);

    List<VideoProgress> findByUserAndStatus(User user, String status);

    @Query("SELECT vp FROM VideoProgress vp WHERE vp.user = :user AND vp.progressPercentage >= 100")
    List<VideoProgress> findCompletedVideosByUser(@Param("user") User user);

    @Query("SELECT COUNT(vp) FROM VideoProgress vp WHERE vp.user = :user AND vp.progressPercentage >= 100")
    long countCompletedVideosByUser(@Param("user") User user);

    @Query("SELECT AVG(vp.progressPercentage) FROM VideoProgress vp WHERE vp.user = :user")
    Double getAverageProgressByUser(@Param("user") User user);
}
