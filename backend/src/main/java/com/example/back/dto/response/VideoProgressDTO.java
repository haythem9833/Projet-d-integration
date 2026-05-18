package com.example.back.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class VideoProgressDTO {

    private Long id;

    private Long userId;

    private Long lessonId;

    private String lessonTitle;

    private Long videoDurationSeconds;

    private Long watchedSeconds;

    private Double progressPercentage;

    private String status;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private LocalDateTime lastWatchedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
