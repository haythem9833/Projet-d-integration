package com.example.back.repository;

import com.example.back.entity.Question;
import com.example.back.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuiz(Quiz quiz);

    List<Question> findByQuizId(Long quizId);
}