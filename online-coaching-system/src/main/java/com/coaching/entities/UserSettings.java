package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settings_id")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "language", length = 10)
    private String language = "en";
    
    @Column(name = "timezone", length = 50)
    private String timezone = "UTC";
    
    @Column(name = "theme_preference", length = 20)
    private String themePreference = "light";
    
    @Column(name = "email_notifications_enabled")
    private Boolean emailNotificationsEnabled = true;
    
    @Column(name = "push_notifications_enabled")
    private Boolean pushNotificationsEnabled = true;
    
    @Column(name = "marketing_emails_enabled")
    private Boolean marketingEmailsEnabled = false;
    
    @Column(name = "course_updates_enabled")
    private Boolean courseUpdatesEnabled = true;
    
    @Column(name = "discussion_replies_enabled")
    private Boolean discussionRepliesEnabled = true;
    
    @Column(name = "profile_visibility", length = 20)
    private String profileVisibility = "public";
    
    @Column(name = "show_online_status")
    private Boolean showOnlineStatus = true;
    
    @Column(name = "allow_messages_from")
    private String allowMessagesFrom = "everyone";
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
