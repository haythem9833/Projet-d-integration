package com.example.back.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Video URL is required")
    private String videoUrl;

    @NotNull(message = "Module ID is required")
    private Long moduleId;

    public LessonRequest() {}

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }
}
