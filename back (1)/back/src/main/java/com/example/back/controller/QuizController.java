package com.example.back.controller;

import com.example.back.dto.request.CreateQuizRequest;
import com.example.back.dto.request.SubmitQuizRequest;
import com.example.back.dto.response.QuizResponse;
import com.example.back.dto.response.QuizResultResponse;
import com.example.back.service.QuizService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // CREATE QUIZ (Trainer/Admin)
    @PostMapping
    public ResponseEntity<QuizResponse> createQuiz(
            @Valid @RequestBody CreateQuizRequest request
    ) {
        QuizResponse response = quizService.createQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET QUIZ BY COURSE
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getQuizByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizByCourse(courseId));
    }

    // SUBMIT QUIZ
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody SubmitQuizRequest request
    ) {
        return ResponseEntity.ok(
                quizService.submitQuiz(quizId, request)
        );
    }
}