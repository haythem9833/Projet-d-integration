package com.example.back.dto.request;

import jakarta.validation.constraints.NotNull;

public class SubmitQuizRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Integer totalAnswers;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getTotalAnswers() {
        return totalAnswers;
    }

    public void setTotalAnswers(Integer totalAnswers) {
        this.totalAnswers = totalAnswers;
    }
}