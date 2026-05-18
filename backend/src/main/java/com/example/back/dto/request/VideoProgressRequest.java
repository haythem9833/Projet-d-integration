package com.example.back.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoProgressRequest {

    private Long lessonId;

    private Long videoDurationSeconds;

    private Long watchedSeconds;

    private Double progressPercentage;

    private String status;
}
