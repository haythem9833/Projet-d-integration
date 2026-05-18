package com.example.back.dto.response;

public class LessonResponse {

    private Long id;
    private String title;
    private String content;
    private String videoUrl;
    private Long moduleId;

    public LessonResponse(Long id, String title, String content, String videoUrl, Long moduleId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.videoUrl = videoUrl;
        this.moduleId = moduleId;
    }

    public Long getId() {
        return id;
    }

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
}
