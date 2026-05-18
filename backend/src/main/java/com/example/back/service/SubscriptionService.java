package com.example.back.service;

import com.example.back.entity.*;
import com.example.back.repository.SubscriptionRepository;
import com.example.back.repository.SubscriptionPlanRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                              SubscriptionPlanRepository subscriptionPlanRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    // ✓ Vérifier si l'utilisateur a un abonnement actif
    public boolean hasActiveSubscription(User user) {
        System.out.println("DEBUG: Checking subscription for user: " + user.getEmail() + " (ID: " + user.getId() + ")");
        System.out.println("DEBUG: Looking for ACTIVE subscriptions...");
        
        List<Subscription> subscriptions = subscriptionRepository.findByUser(user);
        
        for (Subscription subscription : subscriptions) {
            if (subscription.getStatus() == SubscriptionStatus.ACTIVE && subscription.isActive()) {
                System.out.println("DEBUG: Subscription found - ID: " + subscription.getId() + 
                                  ", Status: " + subscription.getStatus() + 
                                  ", EndDate: " + subscription.getEndDate() +
                                  ", IsActive: " + subscription.isActive());
                return true;
            }
        }

        System.out.println("DEBUG: No ACTIVE subscription found for user");
        return false;
    }

    // ✓ Obtenir l'abonnement actif
    public Subscription getActiveSubscription(User user) {
        List<Subscription> subscriptions = subscriptionRepository.findByUser(user);
        
        for (Subscription subscription : subscriptions) {
            if (subscription.getStatus() == SubscriptionStatus.ACTIVE && subscription.isActive()) {
                return subscription;
            }
        }
        
        throw new RuntimeException("No active subscription found");
    }

    // ✓ Créer un nouvel abonnement
    public Subscription createSubscription(User user, SubscriptionPlan plan) {
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartDate(LocalDateTime.now());
        
        // Calculer la date de fin basée sur le cycle de facturation
        LocalDateTime endDate = LocalDateTime.now();
        if (plan.getBillingCycle() == BillingCycle.MONTHLY) {
            endDate = endDate.plusMonths(1);
        } else {
            endDate = endDate.plusYears(1);
        }
        
        subscription.setEndDate(endDate);
        subscription.setRenewalDate(endDate);
        subscription.setAutoRenew(true);

        return subscriptionRepository.save(subscription);
    }

    // ✓ Renouveler un abonnement
    public Subscription renewSubscription(Subscription subscription) {
        LocalDateTime newEndDate = subscription.getEndDate();
        if (subscription.getPlan().getBillingCycle() == BillingCycle.MONTHLY) {
            newEndDate = newEndDate.plusMonths(1);
        } else {
            newEndDate = newEndDate.plusYears(1);
        }

        subscription.setEndDate(newEndDate);
        subscription.setRenewalDate(newEndDate);
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        return subscriptionRepository.save(subscription);
    }

    // ✓ Annuler un abonnement
    public void cancelSubscription(Subscription subscription) {
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);
    }
}
