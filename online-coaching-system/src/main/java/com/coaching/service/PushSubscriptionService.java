package com.coaching.service;

import com.coaching.dto.PushSubscriptionRequest;
import com.coaching.dto.PushSubscriptionResponse;
import com.coaching.entities.PushSubscription;
import com.coaching.repository.PushSubscriptionRepository;
import com.coaching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PushSubscriptionService {
    
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final UserRepository userRepository;
    
    public PushSubscriptionResponse createSubscription(PushSubscriptionRequest request) {
        PushSubscription subscription = new PushSubscription();
        subscription.setUser(userRepository.findById(request.getUserId()).orElseThrow());
        subscription.setEndpoint(request.getEndpoint());
        subscription.setP256dhKey(request.getP256dhKey());
        subscription.setAuthKey(request.getAuthKey());
        subscription.setUserAgent(request.getUserAgent());
        
        subscription = pushSubscriptionRepository.save(subscription);
        return convertToResponse(subscription);
    }
    
    public PushSubscriptionResponse updateSubscription(Integer subscriptionId, PushSubscriptionRequest request) {
        PushSubscription subscription = pushSubscriptionRepository.findById(subscriptionId).orElseThrow();
        if (request.getEndpoint() != null) subscription.setEndpoint(request.getEndpoint());
        if (request.getP256dhKey() != null) subscription.setP256dhKey(request.getP256dhKey());
        if (request.getAuthKey() != null) subscription.setAuthKey(request.getAuthKey());
        subscription.setLastUsedAt(LocalDateTime.now());
        
        subscription = pushSubscriptionRepository.save(subscription);
        return convertToResponse(subscription);
    }
    
    public PushSubscriptionResponse getSubscription(Integer subscriptionId) {
        PushSubscription subscription = pushSubscriptionRepository.findById(subscriptionId).orElseThrow();
        return convertToResponse(subscription);
    }
    
    public List<PushSubscriptionResponse> getUserSubscriptions(Integer userId) {
        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByUser_UserId(userId);
        return subscriptions.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<PushSubscriptionResponse> getActiveSubscriptions() {
        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByIsActiveTrue();
        return subscriptions.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void deactivateSubscription(Integer subscriptionId) {
        PushSubscription subscription = pushSubscriptionRepository.findById(subscriptionId).orElseThrow();
        subscription.setIsActive(false);
        pushSubscriptionRepository.save(subscription);
    }
    
    public void deleteSubscription(Integer subscriptionId) {
        pushSubscriptionRepository.deleteById(subscriptionId);
    }
    
    public void updateLastUsed(Integer subscriptionId) {
        PushSubscription subscription = pushSubscriptionRepository.findById(subscriptionId).orElseThrow();
        subscription.setLastUsedAt(LocalDateTime.now());
        pushSubscriptionRepository.save(subscription);
    }
    
    private PushSubscriptionResponse convertToResponse(PushSubscription subscription) {
        PushSubscriptionResponse response = new PushSubscriptionResponse();
        response.setId(subscription.getId());
        response.setUserId(subscription.getUser().getUserId());
        response.setEndpoint(subscription.getEndpoint());
        response.setP256dhKey(subscription.getP256dhKey());
        response.setAuthKey(subscription.getAuthKey());
        response.setUserAgent(subscription.getUserAgent());
        response.setIsActive(subscription.getIsActive());
        response.setCreatedAt(subscription.getCreatedAt());
        response.setLastUsedAt(subscription.getLastUsedAt());
        return response;
    }
}
