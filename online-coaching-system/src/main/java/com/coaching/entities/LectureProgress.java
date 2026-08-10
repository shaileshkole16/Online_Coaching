package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lecture_progress", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "lecture_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer progressId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    private Boolean watched;
    private Integer watchPercentage;
    private LocalDateTime lastWatched;
    private LocalDateTime completedAt;
}