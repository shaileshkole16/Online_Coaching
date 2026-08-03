package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "live_class_participant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveClassParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "live_class_id", nullable = false)
    private LiveClass liveClass;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "join_time")
    private LocalDateTime joinTime;
    
    @Column(name = "leave_time")
    private LocalDateTime leaveTime;
    
    @Column(name = "duration_attended")
    private Integer durationAttended = 0; // in minutes
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ParticipantStatus status = ParticipantStatus.MISSED;
    
    @PrePersist
    protected void onCreate() {
        if (joinTime != null) {
            status = ParticipantStatus.JOINED;
        }
    }
    
    public enum ParticipantStatus {
        JOINED, LEFT, MISSED
    }
}
