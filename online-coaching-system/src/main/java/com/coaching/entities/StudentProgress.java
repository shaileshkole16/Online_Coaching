package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;
    
    @Column(name = "completion_percentage")
    private Double completionPercentage = 0.0;
    
    @ManyToOne
    @JoinColumn(name = "last_watched_lecture_id")
    private Lecture lastWatchedLecture;
    
    @Column(name = "last_watched_timestamp")
    private java.time.LocalDateTime lastWatchedTimestamp;
    
    @Column(name = "total_time_spent")
    private Integer totalTimeSpent = 0; // in minutes
    
    @Column(name = "completed_lectures", columnDefinition = "TEXT")
    private String completedLectures; // JSON array of lecture IDs
    
    @Column(name = "bookmarked_lectures", columnDefinition = "TEXT")
    private String bookmarkedLectures; // JSON array of lecture IDs
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
