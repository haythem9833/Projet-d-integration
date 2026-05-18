package com.example.back.repository;

import com.example.back.entity.Payment;
import com.example.back.entity.PaymentStatus;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUser(User user);

    List<Payment> findByUserId(Long userId);

    List<Payment> findByStatus(PaymentStatus status);

    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
}
