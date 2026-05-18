package com.example.back.repository;

import com.example.back.entity.Subscription;
import com.example.back.entity.SubscriptionStatus;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserAndStatus(User user, SubscriptionStatus status);
    List<Subscription> findByStatusAndEndDateBefore(SubscriptionStatus status, LocalDateTime date);
    List<Subscription> findByUser(User user);
}
