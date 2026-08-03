package com.coaching.controller;

import com.coaching.dto.PushSubscriptionRequest;
import com.coaching.dto.PushSubscriptionResponse;
import com.coaching.service.PushSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/push-subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PushSubscriptionController {
    
    private final PushSubscriptionService pushSubscriptionService;
    
    @PostMapping("/create")
    public ResponseEntity<PushSubscriptionResponse> createSubscription(@RequestBody PushSubscriptionRequest request) {
        return ResponseEntity.ok(pushSubscriptionService.createSubscription(request));
    }
    
    @PutMapping("/{subscriptionId}")
    public ResponseEntity<PushSubscriptionResponse> updateSubscription(
        @PathVariable Integer subscriptionId,
        @RequestBody PushSubscriptionRequest request
    ) {
        return ResponseEntity.ok(pushSubscriptionService.updateSubscription(subscriptionId, request));
    }
    
    @GetMapping("/{subscriptionId}")
    public ResponseEntity<PushSubscriptionResponse> getSubscription(@PathVariable Integer subscriptionId) {
        return ResponseEntity.ok(pushSubscriptionService.getSubscription(subscriptionId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PushSubscriptionResponse>> getUserSubscriptions(@PathVariable Integer userId) {
        return ResponseEntity.ok(pushSubscriptionService.getUserSubscriptions(userId));
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<PushSubscriptionResponse>> getActiveSubscriptions() {
        return ResponseEntity.ok(pushSubscriptionService.getActiveSubscriptions());
    }
    
    @PostMapping("/{subscriptionId}/deactivate")
    public ResponseEntity<Void> deactivateSubscription(@PathVariable Integer subscriptionId) {
        pushSubscriptionService.deactivateSubscription(subscriptionId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{subscriptionId}/update-last-used")
    public ResponseEntity<Void> updateLastUsed(@PathVariable Integer subscriptionId) {
        pushSubscriptionService.updateLastUsed(subscriptionId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{subscriptionId}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Integer subscriptionId) {
        pushSubscriptionService.deleteSubscription(subscriptionId);
        return ResponseEntity.ok().build();
    }
}
