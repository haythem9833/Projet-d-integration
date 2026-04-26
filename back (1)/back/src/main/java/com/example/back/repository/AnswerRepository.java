package com.example.back.repository;

import com.example.back.entity.Answer;
import com.example.back.entity.User;
import com.example.back.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByUser(User user);

    List<Answer> findByUserId(Long userId);

    List<Answer> findByQuestion(Question question);
}