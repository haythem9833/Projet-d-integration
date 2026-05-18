package com.example.back.service;

import com.example.back.dto.request.VideoProgressRequest;
import com.example.back.dto.response.VideoProgressDTO;
import com.example.back.entity.VideoProgress;
import com.example.back.entity.User;
import com.example.back.entity.Lesson;
import com.example.back.repository.VideoProgressRepository;
import com.example.back.repository.UserRepository;
import com.example.back.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoProgressService {

    private final VideoProgressRepository videoProgressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public VideoProgressService(VideoProgressRepository videoProgressRepository,
                                UserRepository userRepository,
                                LessonRepository lessonRepository) {
        this.videoProgressRepository = videoProgressRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    public VideoProgressDTO updateProgress(Long userId, VideoProgressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        VideoProgress progress = videoProgressRepository.findByUserAndLesson(user, lesson)
                .orElse(new VideoProgress());

        progress.setUser(user);
        progress.setLesson(lesson);
        progress.setVideoDurationSeconds(request.getVideoDurationSeconds());
        progress.setWatchedSeconds(request.getWatchedSeconds());
        progress.setProgressPercentage(request.getProgressPercentage());
        progress.setStatus(request.getStatus());
        progress.setLastWatchedAt(LocalDateTime.now());

        if (request.getProgressPercentage() >= 100) {
            progress.setStatus("COMPLETED");
            progress.setCompletedAt(LocalDateTime.now());
        }

        if (progress.getStartedAt() == null) {
            progress.setStartedAt(LocalDateTime.now());
        }

        VideoProgress saved = videoProgressRepository.save(progress);
        return convertToDTO(saved);
    }

    public VideoProgressDTO getProgress(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        VideoProgress progress = videoProgressRepository.findByUserAndLesson(user, lesson)
                .orElseThrow(() -> new RuntimeException("Video progress not found"));

        return convertToDTO(progress);
    }

    public List<VideoProgressDTO> getUserProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return videoProgressRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VideoProgressDTO> getCompletedVideos(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return videoProgressRepository.findCompletedVideosByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getCompletedVideoCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return videoProgressRepository.countCompletedVideosByUser(user);
    }

    public Double getAverageProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return videoProgressRepository.getAverageProgressByUser(user);
    }

    private VideoProgressDTO convertToDTO(VideoProgress progress) {
        VideoProgressDTO dto = new VideoProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setLessonId(progress.getLesson().getId());
        dto.setLessonTitle(progress.getLesson().getTitle());
        dto.setVideoDurationSeconds(progress.getVideoDurationSeconds());
        dto.setWatchedSeconds(progress.getWatchedSeconds());
        dto.setProgressPercentage(progress.getProgressPercentage());
        dto.setStatus(progress.getStatus());
        dto.setStartedAt(progress.getStartedAt());
        dto.setCompletedAt(progress.getCompletedAt());
        dto.setLastWatchedAt(progress.getLastWatchedAt());
        dto.setCreatedAt(progress.getCreatedAt());
        dto.setUpdatedAt(progress.getUpdatedAt());
        return dto;
    }
}
