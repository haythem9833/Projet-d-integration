package com.example.back.service;

import com.example.back.dto.request.CreateQuizRequest;
import com.example.back.dto.request.SubmitQuizRequest;
import com.example.back.dto.response.QuizResponse;
import com.example.back.dto.response.QuizResultResponse;
import org.springframework.stereotype.Service;

 

@Service
public class QuizService {

    public QuizResponse createQuiz(CreateQuizRequest request) {

        QuizResponse response = new QuizResponse();
        response.setId(1L);
        response.setTitle(request.getTitle());
        response.setCourseId(request.getCourseId());

        return response;
    }

    public QuizResponse getQuizByCourse(Long courseId) {

        QuizResponse response = new QuizResponse();
        response.setId(1L);
        response.setTitle("Java Basics Quiz");
        response.setCourseId(courseId);

        return response;
    }

    public QuizResultResponse submitQuiz(
            Long quizId,
            SubmitQuizRequest request
    ) {

        QuizResultResponse result = new QuizResultResponse();
        result.setQuizId(quizId);
        result.setUserId(request.getUserId());
        result.setScore(85);
        result.setPassed(true);

        return result;
    }
}