package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "platform_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settings_id")
    private Integer id;
    
    @Column(name = "platform_name", length = 100)
    private String platformName = "Online Coaching";
    
    @Column(name = "platform_description", columnDefinition = "TEXT")
    private String platformDescription;
    
    @Column(name = "contact_email", length = 100)
    private String contactEmail;
    
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;
    
    @Column(name = "maintenance_mode")
    private Boolean maintenanceMode = false;
    
    @Column(name = "registration_enabled")
    private Boolean registrationEnabled = true;
    
    @Column(name = "teacher_registration_requires_approval")
    private Boolean teacherRegistrationRequiresApproval = true;
    
    @Column(name = "default_course_approval_required")
    private Boolean defaultCourseApprovalRequired = false;
    
    @Column(name = "max_file_size_mb")
    private Integer maxFileSizeMb = 100;
    
    @Column(name = "allowed_video_formats", columnDefinition = "TEXT")
    private String allowedVideoFormats = "mp4,avi,mov,mkv";
    
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