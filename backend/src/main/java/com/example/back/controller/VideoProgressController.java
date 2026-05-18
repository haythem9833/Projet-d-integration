package com.example.back.controller;

import com.example.back.dto.request.VideoProgressRequest;
import com.example.back.dto.response.VideoProgressDTO;
import com.example.back.service.VideoProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-progress")
public class VideoProgressController {

    private final VideoProgressService videoProgressService;

    public VideoProgressController(VideoProgressService videoProgressService) {
        this.videoProgressService = videoProgressService;
    }

    @PostMapping("/update/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<VideoProgressDTO> updateProgress(
            @PathVariable Long userId,
            @RequestBody VideoProgressRequest request) {
        VideoProgressDTO progress = videoProgressService.updateProgress(userId, request);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{userId}/{lessonId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<VideoProgressDTO> getProgress(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        VideoProgressDTO progress = videoProgressService.getProgress(userId, lessonId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<VideoProgressDTO>> getUserProgress(@PathVariable Long userId) {
        List<VideoProgressDTO> progress = videoProgressService.getUserProgress(userId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/completed/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<VideoProgressDTO>> getCompletedVideos(@PathVariable Long userId) {
        List<VideoProgressDTO> completedVideos = videoProgressService.getCompletedVideos(userId);
        return ResponseEntity.ok(completedVideos);
    }

    @GetMapping("/completed-count/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Long> getCompletedVideoCount(@PathVariable Long userId) {
        long count = videoProgressService.getCompletedVideoCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/average/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Double> getAverageProgress(@PathVariable Long userId) {
        Double averageProgress = videoProgressService.getAverageProgress(userId);
        return ResponseEntity.ok(averageProgress);
    }
}
