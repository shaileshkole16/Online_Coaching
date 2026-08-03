package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "live_class")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveClass {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "live_class_id")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "meeting_link")
    private String meetingLink;
    
    @Column(name = "meeting_id")
    private String meetingId;
    
    @Column(name = "meeting_password")
    private String meetingPassword;
    
    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;
    
    @Column(name = "duration")
    private Integer duration; // in minutes
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LiveClassStatus status = LiveClassStatus.SCHEDULED;
    
    @Column(name = "recording_url")
    private String recordingUrl;
    
    @Column(name = "max_participants")
    private Integer maxParticipants;
    
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
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
    
    public enum LiveClassStatus {
        SCHEDULED, LIVE, COMPLETED, CANCELLED
    }
}
