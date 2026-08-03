package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "push_subscription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "endpoint", nullable = false, columnDefinition = "TEXT")
    private String endpoint;
    
    @Column(name = "p256dh_key", nullable = false)
    private String p256dhKey;
    
    @Column(name = "auth_key", nullable = false)
    private String authKey;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name="last_used_at")
    private LocalDateTime lastUsedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastUsedAt = LocalDateTime.now();
    }
}
