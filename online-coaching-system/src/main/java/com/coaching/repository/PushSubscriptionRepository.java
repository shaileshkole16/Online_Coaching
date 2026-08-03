package com.coaching.repository;

import com.coaching.entities.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Integer> {
    
    List<PushSubscription> findByUser_UserId(Integer userId);
    
    Optional<PushSubscription> findByEndpoint(String endpoint);
    
    List<PushSubscription> findByIsActiveTrue();
}
