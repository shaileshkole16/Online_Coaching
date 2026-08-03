package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String eventName;
    
    @Column(columnDefinition = "TEXT")
    private String properties;
    
    @Column(nullable = false)
    private String sessionId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "user_role")
    private String userRole;
    
    @Column(name = "device_info")
    private String deviceInfo;
    
    @Column(name = "app_version")
    private String appVersion;
    
    @Column(name = "platform")
    private String platform;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
